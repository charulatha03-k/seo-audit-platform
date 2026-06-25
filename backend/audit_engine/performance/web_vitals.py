from typing import Dict, Any

async def measure_vitals(url: str, browser) -> Dict[str, float]:
    page = await browser.new_page()
    await page.goto(url, wait_until="networkidle")
    
    # Simple script to extract paint timing metrics and navigation timing
    metrics = await page.evaluate('''() => {
        const paint = performance.getEntriesByType('paint');
        const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
        const fcp = fcpEntry ? fcpEntry.startTime : 0;
        
        const nav = performance.getEntriesByType('navigation')[0];
        const ttfb = nav ? nav.responseStart - nav.requestStart : 0;
        const load_time = nav ? nav.loadEventEnd - nav.startTime : 0;
        
        return {
            fcp: fcp,
            ttfb: ttfb,
            load_time: load_time
        };
    }''')
    
    await page.close()
    
    # We set lcp, cls, inp to 0 for now as they require web-vitals.js or more complex observers
    return {
        "lcp": 0,
        "cls": 0,
        "inp": 0,
        "fcp": metrics.get("fcp", 0),
        "ttfb": metrics.get("ttfb", 0),
        "load_time": metrics.get("load_time", 0)
    }
