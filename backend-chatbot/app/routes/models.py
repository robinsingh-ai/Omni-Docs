# app/routes/models.py
from fastapi import APIRouter, HTTPException
from app.core.models import ModelsManager, NoAvailableModelsError
from app.core.logger import setup_logger

router = APIRouter()
logger = setup_logger(__name__)

@router.get("/models")
async def list_models():
    """List all available models and their configurations."""
    try:
        await ModelsManager.check_model_availability()
        models = ModelsManager.list_available_models()
        
        if not models:
            raise NoAvailableModelsError("No models are currently available")
            
        return {
            "models": {
                name: {
                    "name": config.name,
                    "provider": config.provider.value,
                    "description": config.description,
                    "context_length": config.context_length,
                    "is_available": config.is_available
                }
                for name, config in models.items()
            }
        }
    except NoAvailableModelsError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Error listing models: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")