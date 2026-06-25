from bs4 import BeautifulSoup
import json
from typing import List, Dict, Any

def extract_schema(soup: BeautifulSoup) -> List[Dict[str, Any]]:
    schemas = []
    scripts = soup.find_all("script", type="application/ld+json")
    for script in scripts:
        try:
            content = script.string
            if content:
                data = json.loads(content)
                if isinstance(data, list):
                    schemas.extend(data)
                else:
                    schemas.append(data)
        except json.JSONDecodeError:
            pass
    return schemas
