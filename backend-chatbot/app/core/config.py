# app/core/config.py
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
import json
from functools import lru_cache

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Existing Settings
    PROJECT_NAME: str
    DEBUG: bool
    HOST: str
    PORT: int
    ENVIRONMENT: str
    CORS_ORIGINS: str
    DEFAULT_MODEL_NAME: str
    ENABLED_MODELS: str
    MODEL_TIMEOUT: int
    DATA_DIR: str
    MAX_CHUNK_SIZE: int
    LOG_LEVEL: str
    RETRIEVAL_SERVICE_PATH: str

    # New Settings for Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # New Settings for Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Optional[str] = None
    REDIS_TTL: int = 3600

    # New Settings for gRPC Services
    GRPC_PORT: int
    LLM_SERVICE_HOST: str
    LLM_SERVICE_PORT: int
    RAG_SERVICE_HOST: str
    RAG_SERVICE_PORT: int

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='ignore'
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

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()