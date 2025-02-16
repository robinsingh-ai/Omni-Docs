# app/agents/crawler_agent.py
from typing import List, Dict
from app.core.logger import setup_logger
from retrieval_service.app.core.enums import DocSource
from retrieval_service.app.retrieval.base import RetrievalPipeline
class CrawlerAgent:
    def __init__(self):
        """Initialize CrawlerAgent with retrieval pipeline."""
        self.pipeline = RetrievalPipeline()
        self.logger = setup_logger(__name__)

    def process_documentation(self, doc_source: str) -> str:
        """Process documentation for a specific source."""
        try:
            self.logger.info(f"Processing documentation for {doc_source}")
            source = DocSource[doc_source.upper()]
            self.pipeline.process_documents(source)
            return f"Successfully processed documentation for {doc_source}"
        except Exception as e:
            self.logger.error(f"Error processing documentation: {e}")
            raise