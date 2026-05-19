# PrivyScan 🍝

> **"You clicked 'I agree.' We actually read it."**

PrivyScan is an AI-powered privacy policy analyzer that summarizes lengthy privacy policies, labels important sections, and rates them from **A to E** based on privacy friendliness — helping users understand what they are agreeing to before clicking accept.

---

## Overview of the Project

PrivyScan simplifies complex privacy policies using AI and Machine Learning. Users can enter a website URL, and the system automatically fetches, summarizes, categorizes, and rates the privacy policy. The goal is to make online privacy information transparent, accessible, and easy to understand.

---

## Models Used

| Task | Model Used |
|---|---|
| Summarization | BART |
| Policy Labelling / Classification | TF-IDF + Logistic Regression |
| Privacy Rating | LegalBERT |

---

## Dataset Used

| Dataset | Description |
|---|---|
| OPP-115 | Annotated dataset of website privacy policies categorized by privacy practices and data usage. |
| ToS;DR | Community-driven dataset that reviews and rates terms of service and privacy policies. |

---

## Methodology

### 1. Preprocessing
- Privacy policy extraction
- Text cleaning
- Chunking large policies into manageable sections

### 2. Summarization
- BART generates simplified summaries for each chunk

### 3. Classification / Labelling
- TF-IDF + Logistic Regression classifies chunks into policy categories

### 4. Privacy Rating
- LegalBERT assigns privacy ratings from A–E based on privacy practices

### 5. Pipeline Integration
- All models are merged into a single end-to-end processing pipeline

---

## Tech Stack

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| ML Inference | Hugging Face Spaces |
| Version Control | GitHub |
| Containerization | Docker |

---

## Backend Setup

### 1. Enter backend folder
```bash
cd backend
```

### 2. Activate virtual environment
```bash
venv/Scripts/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run backend server
```bash
uvicorn app.main:app --reload
```

---

~ by Team Spaghetti 🍝
