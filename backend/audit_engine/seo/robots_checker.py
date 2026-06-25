import httpx
from urllib.parse import urlparse
from typing import List, Dict, Any

async def check_robots_txt(url: str) -> List[Dict[str, str]]:
    issues = []
    parsed_url = urlparse(url)
    robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.head(robots_url, timeout=5.0)
            if response.status_code != 200:
                issues.append({
                    "severity": "Medium",
                    "category": "Technical SEO",
                    "title": "Missing robots.txt",
                    "description": f"Could not find robots.txt at {robots_url} (Status: {response.status_code})."
                })
    except Exception as e:
         issues.append({
            "severity": "Medium",
            "category": "Technical SEO",
            "title": "Missing robots.txt",
            "description": f"Error fetching robots.txt: {str(e)}"
        })
         
    return issues
