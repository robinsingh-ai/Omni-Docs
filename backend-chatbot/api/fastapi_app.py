from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import logging
from typing import List, Optional

from utils.llm_utils import get_llm, get_embeddings
from utils.faiss_utils import FAISSManager
from agents.crawler_agent import CrawlerAgent
from agents.qa_agent import QAAgent

# Models
class CrawlRequest(BaseModel):
    sitemap_url: str
    index_name: str

class QueryRequest(BaseModel):
    query: str
    index_name: str
    chat_history: Optional[List[dict]] = None

# Initialize FastAPI app
app = FastAPI(title="Documentation Chatbot")

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize core components
llm = get_llm()
embeddings = get_embeddings()
faiss_manager = FAISSManager(embeddings)

@app.post("/crawl")
async def crawl_sitemap(request: CrawlRequest):
    """Endpoint to crawl and index documentation."""
    try:
        logger.info(f"Starting crawl for {request.sitemap_url}")
        crawler = CrawlerAgent(llm, faiss_manager)
        result = crawler.crawl_and_index(request.sitemap_url, request.index_name)
        logger.info(f"Crawl completed: {result}")
        return {"message": result}
    except Exception as e:
        logger.error(f"Error in crawl endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def query_docs(request: QueryRequest):
    """Endpoint to query the documentation."""
    try:
        logger.info(f"Processing query for {request.index_name}")
        qa_agent = QAAgent(llm, faiss_manager, request.index_name)
        answer = qa_agent.answer_query(request.query)
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Error in query endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))