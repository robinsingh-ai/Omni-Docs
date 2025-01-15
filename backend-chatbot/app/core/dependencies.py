# app/core/dependencies.py
from functools import lru_cache
from app.utils.llm_utils import get_llm as init_llm
from app.utils.faiss_utils import FAISSManager
from app.utils.llm_utils import get_embeddings
from app.core.config import get_settings

settings = get_settings()

@lru_cache()
def get_llm():
    """Get cached LLM instance."""
    return init_llm(settings.DEFAULT_MODEL_NAME)

@lru_cache()
def get_faiss_manager():
    """Get cached FAISS manager instance."""
    return FAISSManager(get_embeddings(settings.DEFAULT_MODEL_NAME))