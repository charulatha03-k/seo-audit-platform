from typing import List, Dict, Any

def check_canonical(metadata: Dict[str, Any]) -> List[Dict[str, str]]:
    issues = []
    
    canonical = metadata.get("canonical_url")
    if not canonical:
        issues.append({
            "severity": "High",
            "category": "SEO",
            "title": "Missing Canonical URL",
            "description": "The page is missing a canonical link tag."
        })
        
    return issues
