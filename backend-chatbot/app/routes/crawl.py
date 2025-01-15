# app/routes/crawl.py
from fastapi import APIRouter, HTTPException
from app.core.logger import setup_logger
from app.models.requests import CrawlRequest
from app.agents.crawler_agent import CrawlerAgent
from app.core.dependencies import get_llm, get_faiss_manager

router = APIRouter()
logger = setup_logger(__name__)

@router.post("/crawl")
async def crawl_sitemap(request: CrawlRequest):
    """Crawl and index documentation from sitemap."""
    try:
        logger.info(f"Starting crawl for {request.sitemap_url}")
        crawler = CrawlerAgent(get_llm(), get_faiss_manager())
        result = crawler.crawl_and_index(request.sitemap_url, request.index_name)
        logger.info(f"Crawl completed: {result}")
        return {"message": result}
    except Exception as e:
        logger.error(f"Error in crawl endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))