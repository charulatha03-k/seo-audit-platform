from playwright.async_api import async_playwright

async def launch_chrome():
    playwright = await async_playwright().start()
    browser = await playwright.chromium.launch(
        channel="chrome",
        headless=True
    )
    return browser, playwright
