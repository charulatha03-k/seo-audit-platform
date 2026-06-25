import base64
from typing import Dict, Any

async def crawl_page(url: str, browser) -> Dict[str, Any]:
    page = await browser.new_page()
    
    console_errors = []
    network_requests = []
    
    # Capture console errors
    page.on("console", lambda msg: console_errors.append({"type": msg.type, "text": msg.text}) if msg.type == "error" else None)
    page.on("pageerror", lambda exc: console_errors.append({"type": "pageerror", "text": str(exc)}))
    
    # Capture network requests
    page.on("response", lambda response: network_requests.append({
        "url": response.url,
        "status": response.status,
        "content_type": response.headers.get("content-type", "")
    }))
    
    response = None
    try:
        response = await page.goto(url, wait_until="networkidle")
    except Exception as e:
        console_errors.append({"type": "navigation_error", "text": str(e)})
        
    status = response.status if response else 500
    
    html = await page.content()
    title = await page.title()
    final_url = page.url
    
    # Capture screenshot
    screenshot_bytes = await page.screenshot(full_page=True)
    screenshot_b64 = base64.b64encode(screenshot_bytes).decode('utf-8')
    
    await page.close()
    
    return {
        "html": html,
        "title": title,
        "final_url": final_url,
        "status": status,
        "screenshot": screenshot_b64,
        "console_errors": console_errors,
        "network_requests": network_requests
    }
