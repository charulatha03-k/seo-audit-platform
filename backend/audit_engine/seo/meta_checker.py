from typing import List, Dict, Any

def check_meta_description(metadata: Dict[str, Any]) -> List[Dict[str, str]]:
    issues = []
    meta_desc = metadata.get("meta_description")
    
    if not meta_desc:
        issues.append({
            "severity": "High",
            "category": "SEO",
            "title": "Missing Meta Description",
            "description": "The page is missing a meta description."
        })
    else:
        length = len(meta_desc)
        if length < 50:
            issues.append({
                "severity": "Low",
                "category": "SEO",
                "title": "Meta Description Too Short",
                "description": f"The meta description is {length} characters. Recommended length is 50-160 characters."
            })
        elif length > 160:
            issues.append({
                "severity": "Low",
                "category": "SEO",
                "title": "Meta Description Too Long",
                "description": f"The meta description is {length} characters. Recommended length is 50-160 characters."
            })
            
    return issues
