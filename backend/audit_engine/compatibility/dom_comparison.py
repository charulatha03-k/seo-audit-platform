from typing import Dict, Any, List
from bs4 import BeautifulSoup

def compare_dom(browser_results: Dict[str, Dict[str, Any]]) -> List[Dict[str, str]]:
    issues = []
    
    html_lengths = {}
    for browser, data in browser_results.items():
        html = data.get("html", "")
        html_lengths[browser] = len(html)
        
    if not html_lengths:
        return issues
        
    # Check if there's a significant difference (>20% difference between max and min length)
    max_len = max(html_lengths.values())
    min_len = min(html_lengths.values())
    
    if max_len > 0 and (max_len - min_len) / max_len > 0.2:
        issues.append({
            "severity": "High",
            "category": "Compatibility",
            "title": "Significant DOM Differences",
            "description": f"The rendered HTML size varies significantly across browsers: {html_lengths}"
        })
        
    return issues
