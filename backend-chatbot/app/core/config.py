# app/core/config.py
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
import json

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Server Settings
    PROJECT_NAME: str
    DEBUG: bool
    HOST: str
    PORT: int
    ENVIRONMENT: str

    # CORS Settings
    CORS_ORIGINS: str  # Will be parsed from JSON string

    # Model Settings
    DEFAULT_MODEL_NAME: str
    ENABLED_MODELS: str  # Will be parsed from JSON string
    MODEL_TIMEOUT: int

    # Storage Settings
    DATA_DIR: str
    MAX_CHUNK_SIZE: int

    # Logging
    LOG_LEVEL: str

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True
    )

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS from JSON string to list."""
        try:
            return json.loads(self.CORS_ORIGINS)
        except json.JSONDecodeError:
            return []

    @property
    def enabled_models_list(self) -> List[str]:
        """Parse ENABLED_MODELS from JSON string to list."""
        try:
            return json.loads(self.ENABLED_MODELS)
        except json.JSONDecodeError:
            return []

def get_settings() -> Settings:
    """Create and return an instance of Settings."""
    return Settings()