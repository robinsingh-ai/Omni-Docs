# app/routes/crawl.py
from fastapi import APIRouter, HTTPException
from app.core.logger import setup_logger
from app.models.requests import CrawlRequest
from app.agents.crawler_agent import CrawlerAgent
from retrieval_service.app.core.enums import DocSource
router = APIRouter()
logger = setup_logger(__name__)

@router.post("/crawl")
async def process_docs(request: CrawlRequest):
    """Process documentation using the hybrid retrieval pipeline.
    This endpoint is typically called monthly to update documentation."""
    try:
        logger.info(f"Starting documentation processing for {request.index_name}")
        crawler = CrawlerAgent()
        result = crawler.process_documentation(request.index_name)
        logger.info(f"Processing completed: {result}")
        return {"message": result}
        
    except KeyError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid documentation source: {request.index_name}. Must be one of: {', '.join(DocSource.__members__.keys())}"
        )
    except Exception as e:
        logger.error(f"Error in processing endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))