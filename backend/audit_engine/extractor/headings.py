from bs4 import BeautifulSoup
from typing import List, Dict, Any

def extract_headings(soup: BeautifulSoup) -> List[Dict[str, Any]]:
    headings = []
    for tag_name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
        for tag in soup.find_all(tag_name):
            headings.append({
                "level": tag_name,
                "text": tag.get_text(strip=True)
            })
    return headings
