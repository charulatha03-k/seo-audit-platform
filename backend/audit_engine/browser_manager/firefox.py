from playwright.async_api import async_playwright

async def launch_firefox():
    playwright = await async_playwright().start()
    browser = await playwright.firefox.launch(
        headless=True
    )
    return browser, playwright
