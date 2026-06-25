from bs4 import BeautifulSoup
from typing import Dict, Any

def extract_metadata(soup: BeautifulSoup) -> Dict[str, Any]:
    metadata = {
        "title": None,
        "meta_description": None,
        "canonical_url": None,
        "open_graph": {},
        "twitter_cards": {}
    }
    
    # Title
    title_tag = soup.find("title")
    if title_tag:
        metadata["title"] = title_tag.get_text(strip=True)
        
    # Meta Description
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc:
        metadata["meta_description"] = meta_desc.get("content", "").strip()
        
    # Canonical
    canonical = soup.find("link", attrs={"rel": "canonical"})
    if canonical:
        metadata["canonical_url"] = canonical.get("href", "").strip()
        
    # Open Graph & Twitter
    for meta in soup.find_all("meta"):
        property_attr = meta.get("property", "")
        name_attr = meta.get("name", "")
        content = meta.get("content", "").strip()
        
        if property_attr.startswith("og:"):
            metadata["open_graph"][property_attr] = content
        if name_attr.startswith("twitter:"):
            metadata["twitter_cards"][name_attr] = content
            
    return metadata
