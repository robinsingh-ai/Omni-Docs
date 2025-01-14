# main.py
from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
import json
import logging
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

from utils.llm_utils import get_llm, get_embeddings
from utils.faiss_utils import FAISSManager
from agents.crawler_agent import CrawlerAgent
from agents.qa_agent import QAAgent

class CrawlRequest(BaseModel):
    sitemap_url: str
    index_name: str

class QueryRequest(BaseModel):
    query: str
    index_name: str
    chat_history: Optional[List[dict]] = None

class QueryResponse(BaseModel):
    answer: str
    source_documents: List[dict]

app = FastAPI(title="Documentation Chatbot")
api_router = APIRouter(prefix="/api/v1")
origins = [
    'http://localhost:3000', 
    'https://getpostman.com', 
    'https://54dc-2601-18e-d082-96d0-408a-ecf8-e3d5-f538.ngrok-free.app'
    ]

app.add_middleware(
    CORSMiddleware, allow_origins=origins,allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

llm = get_llm()
embeddings = get_embeddings()
faiss_manager = FAISSManager(embeddings)

@api_router.post("/crawl")
async def crawl_sitemap(request: CrawlRequest):
    try:
        logger.info(f"Starting crawl for {request.sitemap_url}")
        crawler = CrawlerAgent(llm, faiss_manager)
        result = crawler.crawl_and_index(request.sitemap_url, request.index_name)
        logger.info(f"Crawl completed: {result}")
        return {"message": result}
    except Exception as e:
        logger.error(f"Error in crawl endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/query", response_model=QueryResponse)
async def query_docs(request: QueryRequest):
    try:
        logger.info(f"Processing query for {request.index_name}")
        qa_agent = QAAgent(llm, faiss_manager, request.index_name)
        result = qa_agent.answer_query(request.query)
        return result
    except Exception as e:
        logger.error(f"Error in query endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

app.include_router(api_router)