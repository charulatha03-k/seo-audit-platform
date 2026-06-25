from typing import List, Dict, Any

def check_links(links_data: Dict[str, List[Dict[str, Any]]], network_requests: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    issues = []
    
    # Simple check: missing hrefs or empty text
    all_links = links_data.get("internal", []) + links_data.get("external", [])
    
    empty_links = 0
    for link in all_links:
        if not link.get("text") and not link.get("href"):
            empty_links += 1
            
    if empty_links > 0:
        issues.append({
            "severity": "Low",
            "category": "SEO",
            "title": "Empty Links",
            "description": f"Found {empty_links} links with no text or href."
        })
        
    # Check broken links from network requests captured by crawler
    failed_requests = [req for req in network_requests if req["status"] >= 400]
    for req in failed_requests:
        url = req["url"]
        # Only flag if it's potentially a link
        issues.append({
            "severity": "Medium",
            "category": "SEO",
            "title": "Broken Link / Failed Request",
            "description": f"Resource failed to load: {url} (Status: {req['status']})"
        })
        
    return issues
