from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
import json
from functools import lru_cache

class Settings(BaseSettings):
    """gRPC server settings."""
    
    # Server Settings
    GRPC_HOST: str = "0.0.0.0"
    GRPC_PORT: int = 50051
    MAX_WORKERS: int = 10
    
    # Model Settings
    DEFAULT_MODEL_NAME: str = "llama3.1"
    ENABLED_MODELS: str = '["llama2", "llama3.1"]'
    MODEL_TIMEOUT: int = 300
    
    # Index Settings
    INDEX_DIR: str = "indexes"
    MAX_CHUNK_SIZE: int = 1000
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True
    )

    @property
    def enabled_models_list(self) -> List[str]:
        """Parse ENABLED_MODELS from JSON string to list."""
        try:
            return json.loads(self.ENABLED_MODELS)
        except json.JSONDecodeError:
            return ["llama2", "llama3.1"]

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings() 