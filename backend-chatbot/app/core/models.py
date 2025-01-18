# app/core/models.py
from enum import Enum
from typing import Dict, Any, Optional, List, Generic, TypeVar
from pydantic import BaseModel, Field
from app.core.logger import setup_logger
from app.core.model_testing import test_model_connection
from app.core.config import get_settings
from app.core.exceptions import NoAvailableModelsError, ModelNotFoundError

T = TypeVar('T')
logger = setup_logger(__name__)

class ModelProvider(str, Enum):
    """Enumeration of supported model providers."""
    OLLAMA = "ollama"
    OPENAI = "openai"

class ModelConfig(BaseModel):
    """Configuration for a language model."""
    name: str = Field(..., description="Model identifier")
    provider: ModelProvider = Field(..., description="Provider of the model")
    context_length: int = Field(..., description="Maximum context length")
    description: str = Field(..., description="Model description")
    parameters: Dict[str, Any] = Field(default_factory=dict, description="Model parameters")
    is_available: bool = Field(default=True, description="Availability status")

class ModelResponse(BaseModel, Generic[T]):
    """Generic response wrapper for model operations."""
    data: T
    is_fallback: bool = False
    message: Optional[str] = None

class ModelsManager:
    """Manager for handling different language models."""
    
    _AVAILABLE_MODELS = {
        "llama2": ModelConfig(
            name="llama2",
            provider=ModelProvider.OLLAMA,
            context_length=4096,
            description="Llama 2 base model via Ollama",
            parameters={"temperature": 0.7}
        ),
        "llama3": ModelConfig(
            name="llama3",
            provider=ModelProvider.OLLAMA,
            context_length=8192,
            description="Llama 3 enhanced model via Ollama",
            parameters={"temperature": 0.7}
        ), 
        "llama3.1": ModelConfig(
            name="llama3.1:8b",  # Using the specific model name from Ollama
            provider=ModelProvider.OLLAMA,
            context_length=8192,
            description="Llama 3.1 8B optimized model via Ollama",
            parameters={
                "temperature": 0.7,
                "top_p": 0.9,
                "top_k": 40
            }
        )
    }

    @classmethod
    async def check_model_availability(cls) -> None:
        settings = get_settings()
        for name, config in cls._AVAILABLE_MODELS.items():
            if name not in settings.ENABLED_MODELS:
                logger.info(f"Skipping disabled model: {name}")
                continue
            try:
                is_available = await test_model_connection(
                    provider=config.provider.value,
                    model_name=config.name,
                    parameters=config.parameters
                )
                config.is_available = is_available
                status = "available" if is_available else "unavailable"
                logger.info(f"Model {name} is {status}")
            except Exception as e:
                logger.warning(f"Error checking model {name}: {str(e)}")
                config.is_available = False

    @classmethod
    def list_available_models(cls) -> Dict[str, ModelConfig]:
        settings = get_settings()
        return {
            name: config for name, config in cls._AVAILABLE_MODELS.items()
            if config.is_available and name in settings.ENABLED_MODELS
        }

    @classmethod
    def get_model_config(cls, model_name: Optional[str] = None) -> ModelResponse[ModelConfig]:
        settings = get_settings()
        available_models = {
            name: config for name, config in cls._AVAILABLE_MODELS.items()
            if config.is_available and name in settings.ENABLED_MODELS
        }

        if not available_models:
            raise NoAvailableModelsError("No models are currently available")

        if not model_name:
            default_model = available_models.get(settings.DEFAULT_MODEL_NAME)
            if default_model:
                return ModelResponse(data=default_model)
            
            fallback_model = next(iter(available_models.values()))
            return ModelResponse(
                data=fallback_model,
                is_fallback=True,
                message=f"Default model not available, using {fallback_model.name}"
            )

        requested_model = cls._AVAILABLE_MODELS.get(model_name)
        if not requested_model:
            raise ModelNotFoundError(f"Model '{model_name}' not found")
            
        if requested_model.is_available and model_name in settings.ENABLED_MODELS:
            return ModelResponse(data=requested_model)

        fallback_model = (
            available_models.get(settings.DEFAULT_MODEL_NAME) or 
            next(iter(available_models.values()))
        )
        return ModelResponse(
            data=fallback_model,
            is_fallback=True,
            message=f"Requested model {model_name} not available, using {fallback_model.name}"
        )