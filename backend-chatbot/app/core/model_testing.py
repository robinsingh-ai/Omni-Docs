# app/core/model_testing.py
from typing import Optional, Dict, Any
from app.core.logger import setup_logger

logger = setup_logger(__name__)

async def test_model_connection(
    provider: str,
    model_name: str,
    parameters: Optional[Dict[str, Any]] = None
) -> bool:
    """Tests if a model is available and responding."""
    try:
        if provider.lower() == 'ollama':
            from langchain.llms import Ollama
            params = parameters or {}
            llm = Ollama(model=model_name, **params)
            llm.predict("test")
            return True
            
        logger.error(f"Unsupported model provider: {provider}")
        return False
        
    except Exception as e:
        logger.error(f"Model connection test failed for {model_name}: {e}")
        return False