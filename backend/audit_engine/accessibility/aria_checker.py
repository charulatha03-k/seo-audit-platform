from bs4 import BeautifulSoup
from typing import List, Dict, Any

def check_aria(soup: BeautifulSoup) -> List[Dict[str, str]]:
    issues = []
    
    # Check buttons and links without text for aria-labels
    for btn in soup.find_all(["button", "a"]):
        text = btn.get_text(strip=True)
        aria_label = btn.get("aria-label", "").strip()
        
        if not text and not aria_label:
            tag_name = btn.name
            issues.append({
                "severity": "Medium",
                "category": "Accessibility",
                "title": f"Missing ARIA Label on {tag_name.capitalize()}",
                "description": f"Found a <{tag_name}> with no text and no aria-label attribute."
            })
            
    # Check images for alt text
    for img in soup.find_all("img"):
        alt = img.get("alt")
        if alt is None:
            issues.append({
                "severity": "High",
                "category": "Accessibility",
                "title": "Missing Alt Text",
                "description": "Found an image missing the alt attribute entirely."
            })
        elif alt.strip() == "" and img.get("role") != "presentation":
            issues.append({
                "severity": "Low",
                "category": "Accessibility",
                "title": "Empty Alt Text",
                "description": "Found an image with empty alt text. Ensure it is decorative, or add role='presentation'."
            })
            
    return issues
