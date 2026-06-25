from .web_vitals import measure_vitals
from typing import Dict, Any, List

async def analyze_performance(url: str, browser) -> Dict[str, Any]:
    metrics = await measure_vitals(url, browser)
    
    issues = []
    
    if metrics["load_time"] > 3000:
        issues.append({
            "severity": "High",
            "category": "Performance",
            "title": "Slow Load Time",
            "description": f"Page load time is {metrics['load_time']:.2f}ms. Recommended is < 3000ms."
        })
        
    if metrics["ttfb"] > 600:
        issues.append({
            "severity": "Medium",
            "category": "Performance",
            "title": "Slow Time To First Byte (TTFB)",
            "description": f"TTFB is {metrics['ttfb']:.2f}ms. Recommended is < 600ms."
        })
        
    return {
        "metrics": metrics,
        "issues": issues
    }
