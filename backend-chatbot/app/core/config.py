# app/core/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings."""
    PROJECT_NAME: str = "Documentation Chatbot"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS Settings
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "https://getpostman.com",
        "https://api-docs-ai.vercel.app"
    ]

    # LLM Settings
    DEFAULT_MODEL_NAME: str = "llama3"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    """Get cached settings."""
    return Settings()