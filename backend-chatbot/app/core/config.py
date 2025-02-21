# app/core/config.py
from typing import List, Dict, Any
from pydantic_settings import BaseSettings, SettingsConfigDict
import json

class Settings(BaseSettings):
    """Application settings with enhanced configuration."""
    
    # Server Settings
    PROJECT_NAME: str = "AI Chatbot"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"

    # Supabase Settings
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_JWT_SECRET: str

    # Redis Settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str | None = None
    REDIS_TTL: int = 3600  # Cache TTL in seconds

    # gRPC Settings
    GRPC_PORT: int = 50051
    LLM_SERVICE_HOST: str = "localhost"
    LLM_SERVICE_PORT: int = 50052
    RAG_SERVICE_HOST: str = "localhost"
    RAG_SERVICE_PORT: int = 50053

    # Model Settings
    DEFAULT_MODEL: str = "llama2"
    MODEL_TIMEOUT: int = 30
    MAX_TOKENS: int = 2000

    # Cache Settings
    CACHE_ENABLED: bool = True
    CACHE_TTL: int = 3600

    # CORS Settings
    CORS_ORIGINS: str  # Will be parsed from JSON string

    # Storage Settings
    DATA_DIR: str
    MAX_CHUNK_SIZE: int

    # Logging
    LOG_LEVEL: str

    RETRIEVAL_SERVICE_PATH: str

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