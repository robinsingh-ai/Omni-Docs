# app/utils/llm_utils.py
from typing import Optional
from langchain.llms import Ollama
from langchain.embeddings import OllamaEmbeddings
from app.core.logger import setup_logger

logger = setup_logger(__name__)

def get_llm(model_name: Optional[str] = None):
    """Initializes and returns an LLM instance with fallback handling."""
    from app.core.models import ModelsManager, ModelProvider, ModelResponse
    
    model_response = ModelsManager.get_model_config(model_name)
    model_config = model_response.data

    if model_config.provider == ModelProvider.OLLAMA:
        llm = Ollama(model=model_config.name, **model_config.parameters)
        return ModelResponse(
            data=llm,
            is_fallback=model_response.is_fallback,
            message=model_response.message
        )

    raise ValueError(f"Unsupported model provider: {model_config.provider}")

def get_embeddings(model_name: Optional[str] = None):
    """Gets embeddings model based on the specified model."""
    from app.core.models import ModelsManager, ModelProvider, ModelResponse
    
    model_response = ModelsManager.get_model_config(model_name)
    model_config = model_response.data

    if model_config.provider == ModelProvider.OLLAMA:
        embeddings = OllamaEmbeddings(model=model_config.name)
        return ModelResponse(
            data=embeddings,
            is_fallback=model_response.is_fallback,
            message=model_response.message
        )

    raise ValueError(f"Unsupported model provider: {model_config.provider}")