# app/core/config.py
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings."""
    
    # Server Settings
    PROJECT_NAME: str = "Documentation Chatbot"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"

    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://getpostman.com",
        "https://api-docs-ai.vercel.app"
    ]

    # Model Settings
    DEFAULT_MODEL_NAME: str = "llama2"
    ENABLED_MODELS: List[str] = ["llama2", "llama3"]
    MODEL_TIMEOUT: int = 30

    # Storage Settings
    DATA_DIR: str = "data"
    MAX_CHUNK_SIZE: int = 4000

    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True
    )

def get_settings() -> Settings:
    """Get application settings."""
    return Settings()