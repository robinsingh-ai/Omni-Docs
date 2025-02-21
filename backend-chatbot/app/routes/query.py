# app/routes/query.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from typing import Tuple, Any, Optional
from app.core.logger import setup_logger
from app.models.requests import QueryRequest, QueryResponse
from app.utils.llm_utils import get_llm
from app.agents.qa_agent import QAAgent
from app.core.models import NoAvailableModelsError, ModelResponse
from app.core.exceptions import ModelNotFoundError
from app.utils.retrival_manager import PipelineManager
from retrieval_service.app.core.enums import DocSource
from app.middleware.auth import auth_middleware

router = APIRouter()
logger = setup_logger(__name__)

async def _initialize_llm(model_name: Optional[str] = None) -> Any:
    """Initialize LLM with error handling."""
    try:
        llm_response = get_llm(model_name)
        
        if llm_response.is_fallback:
            logger.warning("Using fallback model configuration")
            if llm_response.message:
                logger.info(llm_response.message)
        
        return llm_response.data
        
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

@router.on_event("startup")
async def startup_event():
    """Initialize pipelines during app startup"""
    pipeline_manager = PipelineManager()
    # Initialize pipelines for all supported doc sources
    for source in DocSource:
        try:
            pipeline_manager.initialize_pipeline(source)
        except Exception as e:
            logger.error(f"Failed to initialize pipeline for {source.value}: {e}")

@router.post("/query/stream")
async def query_docs_stream(
    request: QueryRequest,
    user: dict = Depends(auth_middleware)  # Add authentication dependency
):
    """Stream query responses with authentication."""
    try:
        logger.info(f"Processing streaming query for {request.index_name}")
        if request.model_name:
            logger.info(f"Using specified model: {request.model_name}")
        
        llm = await _initialize_llm(request.model_name)
        qa_agent = QAAgent(llm, request.index_name)
        
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
async def query_docs(
    request: QueryRequest,
    user: dict = Depends(auth_middleware)  # Add authentication dependency
):
    """Process non-streaming queries with authentication."""
    try:
        logger.info(f"Processing query for {request.index_name}")
        if request.model_name:
            logger.info(f"Using specified model: {request.model_name}")
        
        llm = await _initialize_llm(request.model_name)
        qa_agent = QAAgent(llm, request.index_name)
        
        return qa_agent.answer_query(request.query)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in query endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while processing your request"
        )

@router.get("/query/health")
async def query_health_check():
    """Check health of query service and its dependencies."""
    try:
        # Verify model availability
        llm_response = get_llm()
        
        # Check pipeline health
        pipeline_manager = PipelineManager()
        pipeline_statuses = {}
        for source in DocSource:
            try:
                pipeline_manager.get_pipeline(source)
                pipeline_statuses[source.value] = "active"
            except Exception:
                pipeline_statuses[source.value] = "unavailable"
        
        return {
            "status": "healthy",
            "llm_status": "active" if llm_response.data else "unavailable",
            "pipeline_statuses": pipeline_statuses
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=503,
            detail="Query service is currently unhealthy"
        )