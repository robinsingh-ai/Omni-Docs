# app/routes/query.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import Tuple, Any, Optional
from app.core.logger import setup_logger
from app.models.requests import QueryRequest, QueryResponse
from app.utils.llm_utils import get_llm, get_embeddings
from app.utils.faiss_utils import FAISSManager
from app.agents.qa_agent import QAAgent
from app.core.models import NoAvailableModelsError, ModelResponse
from app.core.exceptions import ModelNotFoundError

router = APIRouter()
logger = setup_logger(__name__)

async def _initialize_models(model_name: Optional[str] = None) -> Tuple[Any, Any]:
    """Initialize LLM and embeddings models with error handling.

    Args:
        model_name: Optional name of the model to use. If None, uses default model.

    Returns:
        Tuple containing the LLM instance and embeddings instance.

    Raises:
        HTTPException: If models are unavailable or not found.
    """
    try:
        llm_response = get_llm(model_name)
        embeddings_response = get_embeddings(model_name)
        
        if llm_response.is_fallback or embeddings_response.is_fallback:
            logger.warning("Using fallback model configuration")
            if llm_response.message:
                logger.info(llm_response.message)
        
        return llm_response.data, embeddings_response.data
        
    except NoAvailableModelsError as e:
        logger.error(f"No available models: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail="No language models are currently available. Please try again later."
        )
    except ModelNotFoundError as e:
        logger.error(f"Model not found: {str(e)}")
        raise HTTPException(
            status_code=404,
            detail=f"Requested model '{model_name}' not found"
        )

@router.post("/query/stream")
async def query_docs_stream(request: QueryRequest):
    """Stream query responses with model selection and fallback handling.

    This endpoint provides a streaming response for document queries, handling model
    selection and falling back to alternative models if necessary.
    """
    try:
        logger.info(f"Processing streaming query for {request.index_name}")
        if request.model_name:
            logger.info(f"Using specified model: {request.model_name}")
        
        llm, embeddings = await _initialize_models(request.model_name)
        
        faiss_manager = FAISSManager(embeddings)
        qa_agent = QAAgent(llm, faiss_manager, request.index_name)
        
        return StreamingResponse(
            qa_agent.answer_query_stream(request.query),
            media_type='application/json'
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in streaming query endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing your request"
        )

@router.post("/query", response_model=QueryResponse)
async def query_docs(request: QueryRequest):
    """Process non-streaming queries with comprehensive error handling.

    This endpoint provides standard responses for document queries, with full
    model selection and error handling capabilities.
    """
    try:
        logger.info(f"Processing query for {request.index_name}")
        if request.model_name:
            logger.info(f"Using specified model: {request.model_name}")
        
        llm, embeddings = await _initialize_models(request.model_name)
        
        faiss_manager = FAISSManager(embeddings)
        qa_agent = QAAgent(llm, faiss_manager, request.index_name)
        
        return qa_agent.answer_query(request.query)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in query endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing your request"
        )

# Health check endpoint for query service
@router.get("/query/health")
async def query_health_check():
    """Check health of query service and its dependencies."""
    try:
        # Verify model availability
        llm_response = get_llm()
        embeddings_response = get_embeddings()
        
        return {
            "status": "healthy",
            "llm_status": "active" if llm_response.data else "unavailable",
            "embeddings_status": "active" if embeddings_response.data else "unavailable",
            "fallback_active": llm_response.is_fallback or embeddings_response.is_fallback
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=503,
            detail="Query service is currently unhealthy"
        )