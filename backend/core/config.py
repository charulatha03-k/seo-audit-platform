import os
from pydantic_settings import BaseSettings, SettingsConfigDict

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.env'))

class Settings(BaseSettings):
    PROJECT_NAME: str = "SEO Audit Platform"
    API_V1_STR: str = "/api"
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379/0"
    
    model_config = SettingsConfigDict(env_file=env_path, extra='ignore')

settings = Settings()
print(f"Loaded DATABASE_URL: {settings.DATABASE_URL}")
