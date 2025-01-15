# app/models/requests.py
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

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