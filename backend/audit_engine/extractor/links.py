from bs4 import BeautifulSoup
from typing import List, Dict, Any
from urllib.parse import urlparse

def extract_links(soup: BeautifulSoup, base_url: str) -> Dict[str, List[Dict[str, Any]]]:
    base_domain = urlparse(base_url).netloc
    
    internal_links = []
    external_links = []
    
    for a in soup.find_all("a"):
        href = a.get("href", "").strip()
        if not href or href.startswith("javascript:") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
            
        link_data = {
            "href": href,
            "text": a.get_text(strip=True),
            "rel": a.get("rel", [])
        }
        
        parsed_href = urlparse(href)
        if not parsed_href.netloc or parsed_href.netloc == base_domain:
            internal_links.append(link_data)
        else:
            external_links.append(link_data)
            
    return {
        "internal": internal_links,
        "external": external_links
    }
