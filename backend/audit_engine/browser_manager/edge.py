from playwright.async_api import async_playwright

async def launch_edge():
    playwright = await async_playwright().start()
    browser = await playwright.chromium.launch(
        channel="msedge",
        headless=True
    )
    return browser, playwright
