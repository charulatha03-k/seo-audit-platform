from typing import List, Dict, Any

def check_title(metadata: Dict[str, Any]) -> List[Dict[str, str]]:
    issues = []
    title = metadata.get("title")
    
    if not title:
        issues.append({
            "severity": "Critical",
            "category": "SEO",
            "title": "Missing Title",
            "description": "The page is missing a <title> tag."
        })
    else:
        length = len(title)
        if length < 30:
            issues.append({
                "severity": "Medium",
                "category": "SEO",
                "title": "Title Too Short",
                "description": f"The title is {length} characters. Recommended length is 30-60 characters."
            })
        elif length > 60:
            issues.append({
                "severity": "Medium",
                "category": "SEO",
                "title": "Title Too Long",
                "description": f"The title is {length} characters. Recommended length is 30-60 characters."
            })
            
    return issues
