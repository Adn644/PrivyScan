from fastapi import APIRouter, HTTPException
from app.models import WebsiteInput
import httpx
from pydantic import BaseModel
from .scraper import scrape_policy_text

router = APIRouter()

HF_API_URL = "https://projectextraction69-privyscan-api.hf.space/analyze"

class URLRequest(BaseModel):
    url: str

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


@router.post("/scan")
def scan(request: URLRequest):
    # Step 1: scrape
    try:
        scraped_text = scrape_policy_text(request.url)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Scraping failed: {str(e)}")

    # Step 2: validate
    if not scraped_text or len(scraped_text.strip()) < 100:
        raise HTTPException(status_code=422, detail="Not enough text found")

    # Step 3: send to HF
    try:
        with httpx.Client(timeout=300.0) as client:  # ← changed from 120 to 300
            response = client.post(
                HF_API_URL,
                json={
                    "url": request.url,
                    "text": scraped_text
                }
            )
        response.raise_for_status()  # ← replaces manual status code check
        return response.json()

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="ML API timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML API error: {str(e)}")