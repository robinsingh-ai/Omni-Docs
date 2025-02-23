from typing import Optional
from langchain.llms import Ollama
from langchain.llms.base import BaseLLM
from langchain.embeddings import OllamaEmbeddings
from core.logger import setup_logger
from core.models import ModelsManager, ModelProvider, ModelConfig, ModelResponse

logger = setup_logger(__name__)

def get_llm(model_config: ModelConfig) -> BaseLLM:
    """Initialize LLM based on model configuration."""
    if model_config.provider == ModelProvider.OLLAMA:
        return Ollama(
            model=model_config.name,
            **model_config.parameters
        )

    raise ValueError(f"Unsupported model provider: {model_config.provider}")

def get_embeddings(model_name: Optional[str] = None) -> OllamaEmbeddings:
    """Get embeddings model."""
    model_response = ModelsManager.get_model_config(model_name)
    model_config = model_response.data

    if model_config.provider == ModelProvider.OLLAMA:
        return OllamaEmbeddings(model=model_config.name)

    raise ValueError(f"Unsupported model provider: {model_config.provider}") 