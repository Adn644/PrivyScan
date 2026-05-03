# ─────────────────────────────────────────────
# PrivyScan ML API
# Runs on: https://projectextraction69-privyscan-api.hf.space/docs
# Endpoint: POST /analyze
# Deployed on: Hugging Face Spaces (Docker)
# ─


import os
import pickle
import torch
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    BartForConditionalGeneration,
)

# ── paths ─────────────────────────────────────────────────────────
BASE_PATH       = os.path.dirname(__file__)
BART_HF_MODEL   = "projectextraction69/bart-privacy-summarizer"
LEGALBERT_PATH  = os.path.join(BASE_PATH, "Legal_Bert", "legal_bert")
CLASSIFIER_PATH = os.path.join(BASE_PATH, "Classifier" , "consolidated_classifier_v1")

# ── labels ────────────────────────────────────────────────────────
RATING_LABELS = ["good", "neutral", "bad", "blocker"]
GRADE_MAP     = {"good": "A", "neutral": "C", "bad": "D", "blocker": "E"}

# ── app ───────────────────────────────────────────────────────────
app = FastAPI(title="PrivyScan API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── load all models on startup ────────────────────────────────────
print("Loading models...")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# BART summarizer
bart_tokenizer = AutoTokenizer.from_pretrained(BART_HF_MODEL, subfolder="bart_finetuned")
bart_model     = BartForConditionalGeneration.from_pretrained(BART_HF_MODEL, subfolder="bart_finetuned", torch_dtype=torch.float16)
bart_model.eval()
bart_model.to(device)

# Legal-BERT rating
rating_tokenizer = AutoTokenizer.from_pretrained(LEGALBERT_PATH)
rating_model     = AutoModelForSequenceClassification.from_pretrained(LEGALBERT_PATH)
rating_model.eval()
rating_model.to(device)

# TF-IDF + LR labeler
with open(os.path.join(CLASSIFIER_PATH, "model.pkl"), "rb") as f:
    label_model = pickle.load(f)
with open(os.path.join(CLASSIFIER_PATH, "vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)
with open(os.path.join(CLASSIFIER_PATH, "label_encoder.pkl"), "rb") as f:
    label_encoder = pickle.load(f)

print(f"All models loaded on {device}!")

# ── step 1: chunker + cleaner ───────────────────────────────────────────────
MAX_TOKENS = 512

def clean_text(text: str) -> str:
    text = text.replace("\r", "\n")
    text = "\n".join(
        line.strip() for line in text.split("\n") if line.strip()
    )
    return text

def chunk_text(text: str, max_tokens: int = MAX_TOKENS):
    text = clean_text(text)
    paragraphs = text.split("\n")

    chunks = []
    current_paragraphs = []
    current_tokens = 0

    for para in paragraphs:
        para_tokens = len(rating_tokenizer.encode(para, add_special_tokens=False))

        if para_tokens > max_tokens:
            if current_paragraphs:
                chunks.append(" ".join(current_paragraphs).strip())

            tokens = rating_tokenizer.encode(para, add_special_tokens=False)
            for i in range(0, len(tokens), max_tokens):
                sub_chunk = rating_tokenizer.decode(tokens[i:i + max_tokens], skip_special_tokens=True)
                chunks.append(sub_chunk.strip())

            current_paragraphs = []
            current_tokens = 0
            continue

        if current_tokens + para_tokens <= max_tokens:
            current_paragraphs.append(para)
            current_tokens += para_tokens
        else:
            chunks.append(" ".join(current_paragraphs).strip())
            current_paragraphs = [para]
            current_tokens = para_tokens

    if current_paragraphs:
        chunks.append(" ".join(current_paragraphs).strip())

    return chunks

# ── step 2: summarizer ────────────────────────────────────────────
def summarize(text):
    inputs = bart_tokenizer(
        text,
        return_tensors="pt",
        max_length=512,
        truncation=True
    ).to(device)

    with torch.no_grad():
        summary_ids = bart_model.generate(
            inputs["input_ids"],
            max_length=128,
            min_length=20,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True
        )

    summary = bart_tokenizer.decode(
        summary_ids[0], skip_special_tokens=True
    )
    return summary

# ── step 3: labeler ───────────────────────────────────────────────
def classify_label(summary):
    vec   = vectorizer.transform([summary])
    pred  = label_model.predict(vec)[0]
    proba = label_model.predict_proba(vec)[0]
    label = label_encoder.inverse_transform([pred])[0]
    conf  = round(float(proba.max()), 4)
    return {"label": label, "confidence": conf}

# ── step 4: rater ─────────────────────────────────────────────────
BLOCKER_KEYWORDS = {
    "sell your personal data"       : [],
    "sell your data"                : [],
    "sold to third parties"         : [],
    "we may sell"                   : [],
    "waive your right to a jury"    : [],
    "binding individual arbitration": [],
    "class action lawsuits"         : [],
    "applied retroactively"         : [],
    "children under the age of 13"  : ["does not", "do not", "don't",
                                        "never", "not knowingly"],
    "children under 13"             : ["does not", "do not", "don't",
                                        "never", "not knowingly"],
    "directed to children"          : ["not directed", "is not", "are not"],
    "collect from children"         : ["does not", "do not", "don't", "never"],
}

NEUTRAL_KEYWORDS = [
    "governed by the laws",
    "jurisdiction",
    "court of law",
    "applicable laws",
    "governing law",
    "legal obligations",
    "retain your personal data for as long",
]

def has_negation(text_lower, phrase, negations):
    idx = text_lower.find(phrase)
    if idx == -1:
        return False
    context = text_lower[max(0, idx - 60):idx]
    return any(n in context for n in negations)

def classify_rating(text, blocker_threshold=0.10):
    text_lower = text.lower()

    for phrase, negations in BLOCKER_KEYWORDS.items():
        if phrase in text_lower:
            if negations and has_negation(text_lower, phrase, negations):
                return {"label": "good", "grade": "A",
                        "confidence": 1.0, "override": "negation"}
            return {"label": "blocker", "grade": "E",
                    "confidence": 1.0, "override": "keyword"}

    for phrase in NEUTRAL_KEYWORDS:
        if phrase in text_lower:
            return {"label": "neutral", "grade": "C",
                    "confidence": 1.0, "override": "keyword"}

    inputs = rating_tokenizer(
        text, truncation=True, padding="max_length",
        max_length=256, return_tensors="pt"
    ).to(device)

    with torch.no_grad():
        logits = rating_model(**inputs).logits
        probs  = torch.softmax(logits, dim=-1)[0]

    scores    = {RATING_LABELS[i]: round(probs[i].item(), 4)
                 for i in range(len(RATING_LABELS))}
    predicted = max(scores, key=scores.get)

    if scores["blocker"] > blocker_threshold:
        predicted = "blocker"

    return {
        "label"     : predicted,
        "grade"     : GRADE_MAP[predicted],
        "confidence": round(scores[predicted], 4),
        "override"  : None
    }

# ── step 5: aggregator ────────────────────────────────────────────
def aggregate_grade(chunks):
    score_map = {"good": 2, "neutral": 0, "bad": -2, "blocker": -4}

    confirmed_blockers = [
        c for c in chunks
        if c["rating"]["label"] == "blocker"
        and c["rating"].get("override") is None
    ]
    keyword_blockers = [
        c for c in chunks
        if c["rating"]["label"] == "blocker"
        and c["rating"].get("override") == "keyword"
    ]

    if len(confirmed_blockers) >= 2:
        return "E"
    if len(confirmed_blockers) >= 1 and len(keyword_blockers) >= 1:
        return "E"

    score = 0
    for c in chunks:
        label = c["rating"]["label"]
        if label == "blocker" and c["rating"].get("override") == "keyword":
            score += score_map["bad"]
        else:
            score += score_map[label]

    avg = score / len(chunks)

    if avg >= 1.2:  return "A"
    if avg >= 0.4:  return "B"
    if avg >= -0.4: return "C"
    if avg >= -1.2: return "D"
    return "E"

# ── request schema ────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    url : str = ""
    text: str

# ── main endpoint ─────────────────────────────────────────────────
@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    text   = request.text.strip()
    chunks = chunk_text(text)

    result_chunks = []
    for i, chunk in enumerate(chunks):
        summary      = summarize(chunk)
        label_result = classify_label(summary)
        rating_result = classify_rating(chunk)

        result_chunks.append({
            "chunk_id"  : i + 1,
            "summary"   : summary,
            "label"     : label_result["label"],
            "confidence": label_result["confidence"],
            "rating"    : rating_result,
        })

    overall = aggregate_grade(result_chunks)

    return {
        "url"          : request.url,
        "overall_grade": overall,
        "total_chunks" : len(result_chunks),
        "chunks"       : result_chunks
    }

# ── health check ──────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "ok", "service": "PrivyScan API"}
