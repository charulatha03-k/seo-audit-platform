from typing import List, Dict, Any

def check_headings(headings: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    issues = []
    
    h1_count = sum(1 for h in headings if h["level"] == "h1")
    
    if h1_count == 0:
        issues.append({
            "severity": "High",
            "category": "SEO",
            "title": "Missing H1",
            "description": "The page is missing an <h1> heading."
        })
    elif h1_count > 1:
        issues.append({
            "severity": "Medium",
            "category": "SEO",
            "title": "Multiple H1 Headings",
            "description": f"The page has {h1_count} <h1> headings. It's recommended to have exactly one."
        })
        
    return issues
