# app/routes/query.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.core.logger import setup_logger
from app.models.requests import QueryRequest, QueryResponse
from app.agents.qa_agent import QAAgent
from app.core.dependencies import get_llm, get_faiss_manager

router = APIRouter()
logger = setup_logger(__name__)

@router.post("/query/stream")
async def query_docs_stream(request: QueryRequest):
    """Stream query response with markdown formatting."""
    try:
        logger.info(f"Processing streaming query for {request.index_name}")
        qa_agent = QAAgent(get_llm(), get_faiss_manager(), request.index_name)
        return StreamingResponse(
            qa_agent.answer_query_stream(request.query),
            media_type='application/json'
        )
    except Exception as e:
        logger.error(f"Error in streaming query endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=QueryResponse)
async def query_docs(request: QueryRequest):
    """Query documentation with standard response."""
    try:
        logger.info(f"Processing query for {request.index_name}")
        qa_agent = QAAgent(get_llm(), get_faiss_manager(), request.index_name)
        result = qa_agent.answer_query(request.query)
        return result
    except Exception as e:
        logger.error(f"Error in query endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))