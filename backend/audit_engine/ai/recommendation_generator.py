import json
from typing import List, Dict, Any
from .groq_client import generate_completion
from .prioritization import prioritize_recommendations

async def generate_recommendations(issues: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    if not issues:
        return []
        
    prompt = f"""
    Given the following list of website audit issues, generate actionable recommendations.
    Return a JSON object with a key 'recommendations' which is an array of objects.
    Each object must have the following keys:
    - 'title': A concise title for the recommendation.
    - 'recommendation': Actionable advice on how to fix it.
    - 'priority': 'Critical', 'High', 'Medium', or 'Low'
    - 'impact': Which category this impacts (e.g., 'SEO', 'Performance', 'Accessibility', 'Compatibility')
    
    Issues:
    {json.dumps(issues, indent=2)}
    """
    
    try:
        response_text = await generate_completion(prompt)
        
        # If the API key is not set, we'll get a string back that's not JSON
        if "GROQ_API_KEY not set" in response_text:
            return [{"error": response_text}]
            
        data = json.loads(response_text)
        recommendations = data.get("recommendations", [])
        return prioritize_recommendations(recommendations)
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return []
