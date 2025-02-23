from typing import Optional, Dict, Any
import asyncio
from core.logger import setup_logger
from core.exceptions import ModelInitializationError

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
            
            # Default parameters if none provided
            params = parameters or {}
            
            # Create LLM instance
            llm = Ollama(
                model=model_name,
                **params
            )
            
            # Test with a simple prompt
            test_prompt = "Test connection with a simple response."
            
            # Run in executor to prevent blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: llm.predict(test_prompt)
            )
            
            logger.info(f"Successfully tested connection to {model_name}")
            return True
            
        elif provider.lower() == 'openai':
            # Add OpenAI testing logic here if needed
            logger.warning("OpenAI provider testing not implemented yet")
            return False
            
        logger.error(f"Unsupported model provider: {provider}")
        return False
        
    except Exception as e:
        logger.error(f"Model connection test failed for {model_name}: {e}")
        if "connection refused" in str(e).lower():
            raise ModelInitializationError(
                f"Could not connect to {provider} service. Is it running?"
            )
        return False

async def test_embedding_model(
    provider: str,
    model_name: str
) -> bool:
    """Tests if an embedding model is available and responding."""
    try:
        if provider.lower() == 'ollama':
            from langchain.embeddings import OllamaEmbeddings
            
            # Create embeddings instance
            embeddings = OllamaEmbeddings(
                model=model_name
            )
            
            # Test with a simple text
            test_text = "Test embedding generation."
            
            # Run in executor to prevent blocking
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                None,
                lambda: embeddings.embed_query(test_text)
            )
            
            logger.info(f"Successfully tested embeddings for {model_name}")
            return True
            
        logger.error(f"Unsupported embeddings provider: {provider}")
        return False
        
    except Exception as e:
        logger.error(f"Embeddings test failed for {model_name}: {e}")
        return False 