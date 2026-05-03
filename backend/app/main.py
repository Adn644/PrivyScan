import httpx
from pydantic import BaseModel
from .scraper import scrape_policy_text

HF_API_URL = "https://projectextraction69-privyscan-api.hf.space/analyze"

class URLRequest(BaseModel):
    url: str

@app.post("/scan")
async def scan(request: URLRequest):
    
    try:
        scraped_text = scrape_policy_text(request.url)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Scraping failed: {str(e)}")

    if not scraped_text or len(scraped_text.strip()) < 100:
        raise HTTPException(status_code=422, detail="Not enough text found on page")

    # send scraped text to HF API
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                HF_API_URL,
                json={
                    "url" : request.url,
                    "text": scraped_text
                }
            )
            result = response.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="ML API timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML API error: {str(e)}")

    # return result to frontend
    return result
