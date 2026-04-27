from fastapi import APIRouter
from app.models import WebsiteInput, PolicyTextInput
from app.scraper import scrape_policy_text
from app.chunker import chunk_by_paragraph

router = APIRouter()


@router.get("/")
def home():
    return {"message": "Backend is running"}


@router.post("/scrape-policy")
def scrape_policy(data: WebsiteInput):
    try:
        policy_text = scrape_policy_text(data.url)

        return {
            "url": data.url,
            "policy_text": policy_text
        }

    except Exception as e:
        return {"error": str(e)}


@router.post("/chunk-policy")
def chunk_policy(data: PolicyTextInput):
    try:
        chunks = chunk_by_paragraph(data.policy_text)

        return {
            "message": "Policy chunked successfully",
            "total_chunks": len(chunks),
            "max_tokens_per_chunk": 500,
            "chunks": chunks
        }

    except Exception as e:
        return {"error": str(e)}