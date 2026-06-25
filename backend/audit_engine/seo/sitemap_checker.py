import httpx
from urllib.parse import urlparse
from typing import List, Dict, Any

async def check_sitemap(url: str) -> List[Dict[str, str]]:
    issues = []
    parsed_url = urlparse(url)
    sitemap_url = f"{parsed_url.scheme}://{parsed_url.netloc}/sitemap.xml"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.head(sitemap_url, timeout=5.0)
            if response.status_code != 200:
                issues.append({
                    "severity": "Medium",
                    "category": "Technical SEO",
                    "title": "Missing sitemap.xml",
                    "description": f"Could not find sitemap.xml at {sitemap_url} (Status: {response.status_code})."
                })
    except Exception as e:
         issues.append({
            "severity": "Medium",
            "category": "Technical SEO",
            "title": "Missing sitemap.xml",
            "description": f"Error fetching sitemap.xml: {str(e)}"
        })
         
    return issues
