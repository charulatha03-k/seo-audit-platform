from bs4 import BeautifulSoup
from typing import List, Dict, Any

def check_keyboard_nav(soup: BeautifulSoup) -> List[Dict[str, str]]:
    issues = []
    
    # Find interactive elements with tabindex="-1" which removes them from keyboard flow
    for elem in soup.find_all(["a", "button", "input", "select", "textarea"]):
        tabindex = elem.get("tabindex")
        if tabindex == "-1":
             issues.append({
                "severity": "Medium",
                "category": "Accessibility",
                "title": "Interactive Element not Keyboard Focusable",
                "description": f"Found a <{elem.name}> element with tabindex='-1'."
            })
            
    # Find positive tabindex which is an anti-pattern
    for elem in soup.find_all(True):
        tabindex = elem.get("tabindex")
        if tabindex and tabindex.isdigit() and int(tabindex) > 0:
            issues.append({
                "severity": "Low",
                "category": "Accessibility",
                "title": "Positive Tabindex",
                "description": "Using a tabindex greater than 0 disrupts the natural reading order."
            })
            
    return issues
