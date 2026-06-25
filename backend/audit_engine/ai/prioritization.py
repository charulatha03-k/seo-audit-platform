from typing import List, Dict, Any

def prioritize_recommendations(recommendations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    priority_map = {
        "Critical": 1,
        "High": 2,
        "Medium": 3,
        "Low": 4
    }
    
    return sorted(recommendations, key=lambda x: priority_map.get(x.get("priority", "Low"), 5))
