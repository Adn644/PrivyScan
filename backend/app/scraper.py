from playwright.sync_api import sync_playwright

def scrape_policy_text(url: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox"]
        )
        page = browser.new_page()

        page.goto(url, timeout=60000)
        page.wait_for_load_state("networkidle")

        text = page.inner_text("body")

        browser.close()
        return text
