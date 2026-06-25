from bs4 import BeautifulSoup
from typing import List, Dict, Any

def extract_images(soup: BeautifulSoup) -> List[Dict[str, Any]]:
    images = []
    for img in soup.find_all("img"):
        images.append({
            "src": img.get("src", "").strip(),
            "alt": img.get("alt", None)
        })
    return images
