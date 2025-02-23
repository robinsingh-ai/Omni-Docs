from typing import Dict, Any, Union
from core.logger import setup_logger
from retrieval_service.app.core.enums import DocSource
from retrieval_service.app.retrieval.base import RetrievalPipeline

logger = setup_logger(__name__)

class PipelineManager:
    _instance = None
    _pipelines: Dict[str, Any] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PipelineManager, cls).__new__(cls)
            cls._instance.logger = setup_logger(__name__)
        return cls._instance

    async def initialize_pipeline(self, source: str):
        """Initialize pipeline for a specific doc source if not already initialized"""
        try:
            doc_source = DocSource[source.upper()]
            if source not in self._pipelines:
                pipeline = RetrievalPipeline()
                pipeline.load_source(doc_source)
                self._pipelines[source] = pipeline
                self.logger.info(f"Successfully initialized pipeline for {source}")
        except Exception as e:
            self.logger.error(f"Error initializing pipeline for {source}: {e}")
            raise

    async def get_pipeline(self, source: str) -> Any:
        """Get pipeline for a specific doc source"""
        if source not in self._pipelines:
            await self.initialize_pipeline(source)
        return self._pipelines[source]

    async def search_documents(self, source: str, query: str):
        """Search documents using the appropriate pipeline"""
        try:
            pipeline = await self.get_pipeline(source)
            return pipeline.search_documents(query)
        except Exception as e:
            self.logger.error(f"Error searching documents: {e}")
            raise