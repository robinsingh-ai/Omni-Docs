# main.py
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import json
import logging
from typing import List, Optional, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
import psutil
import time
from datetime import datetime
import os

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

class StatusResponse(BaseModel):
    status: str
    timestamp: str
    uptime: float
    server_stats: Dict[str, Any]
    components: Dict[str, str]

app = FastAPI(title="Documentation Chatbot")
api_router = APIRouter(prefix="/api/v1")

origins = [
    'http://localhost:3000', 
    'https://getpostman.com', 
     'https://api-docs-ai.vercel.app/', 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

SERVER_START_TIME = time.time()

llm = get_llm()
embeddings = get_embeddings()
faiss_manager = FAISSManager(embeddings)

@api_router.get("/status", response_model=StatusResponse)
async def server_status():
    """Get server status and health metrics"""
    try:
        # Calculate uptime
        uptime = time.time() - SERVER_START_TIME
        
        # Get system stats
        cpu_usage = psutil.cpu_percent()
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Check components status
        components_status = {
            "server": "operational",
        }
        
        # Check FAISS more safely
        try:
            # Check if data directory exists and has any indices
            data_dir = "data"
            if os.path.exists(data_dir) and len(os.listdir(data_dir)) > 0:
                components_status["faiss"] = "operational"
            else:
                components_status["faiss"] = "no indices"
        except Exception:
            components_status["faiss"] = "error"
        
        # Check LLM
        try:
            llm.predict("test")
            components_status["llm"] = "operational"
        except Exception:
            components_status["llm"] = "error"

        return {
            "status": "operational",
            "timestamp": datetime.now().isoformat(),
            "uptime": round(uptime, 2),
            "server_stats": {
                "cpu_usage_percent": cpu_usage,
                "memory_usage_percent": memory.percent,
                "disk_usage_percent": disk.percent,
                "memory_available_gb": round(memory.available / (1024**3), 2),
                "disk_free_gb": round(disk.free / (1024**3), 2)
            },
            "components": components_status
        }
    except Exception as e:
        logger.error(f"Error checking server status: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "error",
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            }
        )

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

@api_router.post("/query/stream")
async def query_docs_stream(request: QueryRequest):
    try:
        logger.info(f"Processing streaming query for {request.index_name}")
        qa_agent = QAAgent(llm, faiss_manager, request.index_name)
        return StreamingResponse(
            qa_agent.answer_query_stream(request.query),
            media_type='text/markdown'
        )
    except Exception as e:
        logger.error(f"Error in streaming query endpoint: {e}")
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