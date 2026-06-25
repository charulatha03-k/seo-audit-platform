from typing import Dict, Any, List

def compare_network_failures(browser_results: Dict[str, Dict[str, Any]]) -> List[Dict[str, str]]:
    issues = []
    
    for browser, data in browser_results.items():
        requests = data.get("network_requests", [])
        failed = [r for r in requests if r["status"] >= 400]
        if len(failed) > 0:
            issues.append({
                "severity": "Medium",
                "category": "Compatibility",
                "title": f"Network Failures in {browser.capitalize()}",
                "description": f"Found {len(failed)} failed network requests when running in {browser.capitalize()}."
            })
            
    return issues
