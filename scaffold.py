import os

files = {
    'requirements.txt': '''fastapi
uvicorn
sqlalchemy
psycopg2-binary
alembic
pydantic
pydantic-settings
celery
redis
reportlab
pytest
pytest-asyncio
httpx
python-multipart
python-dotenv
''',
    '.env.example': '''DATABASE_URL=postgresql://user:password@localhost/seo_audit
REDIS_URL=redis://localhost:6379/0
API_V1_STR=/api
PROJECT_NAME=SEO Audit Platform
''',
    'backend/core/config.py': '''from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SEO Audit Platform"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./seo_audit.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    class Config:
        env_file = ".env"

settings = Settings()
''',
    'backend/core/logger.py': '''import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)
''',
    'backend/core/constants.py': '''# Constants
''',
    'backend/core/exceptions.py': '''from fastapi import HTTPException

class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Not found"):
        super().__init__(status_code=404, detail=detail)
''',
    'backend/main.py': '''from fastapi import FastAPI
from core.config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "SEO Audit Platform API is running"}
''',
}

for filepath, content in files.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True) if os.path.dirname(filepath) else None
    with open(filepath, 'w') as f:
        f.write(content)
