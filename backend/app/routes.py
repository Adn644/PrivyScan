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

