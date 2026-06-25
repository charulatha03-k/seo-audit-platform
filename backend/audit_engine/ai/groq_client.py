import os
from groq import AsyncGroq
from dotenv import load_dotenv

load_dotenv()

async def get_groq_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return AsyncGroq(api_key=api_key)

async def generate_completion(prompt: str, system_prompt: str = "You are an expert SEO and Web Performance consultant. You must respond in JSON format.") -> str:
    client = await get_groq_client()
    if not client:
        return "GROQ_API_KEY not set. Cannot generate recommendations."
        
    # Read the model from the environment variable, or use a default if not set
    model_name = os.getenv("GROQ_MODEL", "llama-4-scout")
        
    response = await client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        model=model_name,
        temperature=0.2,
        response_format={"type": "json_object"}
    )
    return response.choices[0].message.content
