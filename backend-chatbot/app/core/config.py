# app/core/config.py
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
import json

class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Server Settings
    PROJECT_NAME: str
    DEBUG: bool
    HOST: str
    PORT: int
    ENVIRONMENT: str

    # CORS Settings
    CORS_ORIGINS: List[str]

    # LLM Settings
    DEFAULT_MODEL_NAME: str

    # Storage Settings
    DATA_DIR: str
    MAX_CHUNK_SIZE: int

    # Logging
    LOG_LEVEL: str

    # Custom JSON parsing for CORS_ORIGINS
    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            return json.loads(self.CORS_ORIGINS)
        return self.CORS_ORIGINS

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True
    )

def get_settings() -> Settings:
    """Get application settings."""
    return Settings()