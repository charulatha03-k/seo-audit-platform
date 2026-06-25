from typing import Dict, Any, List

def compare_js_errors(browser_results: Dict[str, Dict[str, Any]]) -> List[Dict[str, str]]:
    issues = []
    
    # We expect browser_results to look like:
    # {"chrome": {"console_errors": [...]}, "edge": {"console_errors": [...]}, ...}
    
    for browser, data in browser_results.items():
        errors = data.get("console_errors", [])
        if len(errors) > 0:
            issues.append({
                "severity": "Medium",
                "category": "Compatibility",
                "title": f"JavaScript Errors in {browser.capitalize()}",
                "description": f"Found {len(errors)} console errors when running in {browser.capitalize()}."
            })
            
    return issues
