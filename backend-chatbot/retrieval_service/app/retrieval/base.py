from typing import Dict, List, Optional
from ..core.config import Config
from ..core.singleton import Singleton
from ..core.enums import DocSource
from .processing import URLFetcher, TextChunker
from .embeddings import DenseEmbedder, SparseEmbedder
from .scoring import HybridSearch, RelevanceChecker, Reranker
from ..storage import DataManager
from ..utils.logger import logger
import torch

class RetrievalPipeline(metaclass=Singleton):
    """Main retrieval pipeline that coordinates all components."""
    
    def __init__(self):
        self.config = Config()
        self.data_manager = DataManager()
        
        # Initialize components
        self.fetcher = URLFetcher()
        self.chunker = TextChunker()
        self.dense_embedder = DenseEmbedder()
        self.sparse_embedder = SparseEmbedder()
        self.search = HybridSearch()
        self.relevance_checker = RelevanceChecker()
        
        # Current state
        self.current_source: Optional[DocSource] = None
        self.chunks: List[str] = []
        self.chunk_to_url: Dict[str, str] = {}
    
    def process_documents(self, source: DocSource) -> None:
        """Process documents for a specific source."""
        try:
            logger.info(f"Processing documents for {source.value}")
            
            # Clear existing data
            self.data_manager.clear_data(source)
            
            # Fetch URLs from sitemap
            urls = self.fetcher.fetch_sitemap(source.sitemap_url)
            if not urls:
                raise ValueError(f"No URLs found for {source.value}")
            
            # Fetch and process content
            documents = self.fetcher.fetch_all_contents(urls)
            chunked_docs = self.chunker.chunk_documents(documents)
            
            # Prepare chunks and URL mapping
            self.chunks = []
            self.chunk_to_url = {}
            
            for url, chunks in chunked_docs.items():
                for chunk in chunks:
                    chunk_idx = str(len(self.chunks))
                    self.chunks.append(chunk)
                    self.chunk_to_url[chunk_idx] = url
            
            # Generate embeddings
            dense_embeddings = self.dense_embedder.embed_texts(self.chunks)
            sparse_embeddings = self.sparse_embedder.embed_texts(self.chunks)
            
            # Save all data
            self.data_manager.save_data(
                source,
                self.chunks,
                self.chunk_to_url,
                sparse_embeddings,
                dense_embeddings,
                self.dense_embedder.index
            )
            
            self.current_source = source
            logger.info(f"Successfully processed documents for {source.value}")
            
        except Exception as e:
            logger.error(f"Error processing documents: {str(e)}")
            raise
    
    def load_source(self, source: DocSource) -> None:
        """Load data for a specific source."""
        try:
            if not self.data_manager.check_data_exists(source):
                logger.info(f"No existing data found for {source.value}")
                self.process_documents(source)
                return
            
            logger.info(f"Loading data for {source.value}")
            data = self.data_manager.load_data(source)
            
            self.chunks = data["chunks"]
            self.chunk_to_url = data["chunk_to_url"]
            self.dense_embedder.embeddings = data["dense_embeddings"]
            self.dense_embedder.index = data["dense_index"]
            self.sparse_embedder.embeddings = data["sparse_embeddings"]
            
            self.current_source = source
            logger.info(f"Successfully loaded data for {source.value}")
            
        except Exception as e:
            logger.error(f"Error loading source: {str(e)}")
            raise
    
    def search_documents(self, query: str) -> Dict:
        """Search documents with relevance checking."""
        if not self.current_source:
            raise ValueError("No documentation source loaded")
        
        try:
            # Perform hybrid search
            results = self.search.search(query, self.chunks)
            
            # Check relevance
            query_embedding = torch.tensor(
                list(self.dense_embedder.model.embed([query]))[0],
                device=self.config.device
            )
            
            is_relevant, confidence = self.relevance_checker.check_relevance(
                query,
                results,
                query_embedding,
                self.dense_embedder.embeddings
            )
            
            if not is_relevant:
                return {
                    "status": "no_results",
                    "message": "No relevant documents found",
                    "confidence": f"{confidence:.2f}"
                }
            
            # Format results
            processed_results = []
            for result in results:
                processed_results.append({
                    "text": result["text"][:350] + "..." 
                           if len(result["text"]) > 350 
                           else result["text"],
                    "url": self.chunk_to_url.get(str(result["index"]), ""),
                    "scores": {
                        "final": round(result["scores"]["final"], 3),
                        "dense": round(result["scores"]["dense"], 3),
                        "sparse": round(result["scores"]["sparse"], 3),
                        "rerank": round(result["scores"]["rerank"], 3)
                    }
                })
            
            return {
                "status": "success",
                "confidence": f"{confidence:.2f}",
                "results": processed_results
            }
            
        except Exception as e:
            logger.error(f"Error searching documents: {str(e)}")
            raise
            
    def get_source_stats(self) -> Dict:
        """Get statistics about the current source."""
        if not self.current_source:
            return {
                "status": "no_source",
                "message": "No documentation source loaded"
            }
            
        try:
            return {
                "source": self.current_source.value,
                "total_chunks": len(self.chunks),
                "total_urls": len(set(self.chunk_to_url.values())),
                "embedding_dimension": self.dense_embedder.embeddings.shape[1],
                "device": self.config.device
            }
        except Exception as e:
            logger.error(f"Error getting source stats: {str(e)}")
            raise
            
    def process_query_with_context(
        self,
        query: str,
        chat_history: List[Dict[str, str]] = None
    ) -> Dict:
        """Process query with optional chat history context."""
        if not chat_history:
            chat_history = []
            
        try:
            # Format context from chat history
            context = "\n".join([
                f"{msg['role']}: {msg['content']}"
                for msg in chat_history[-5:]  # Use last 5 messages
            ])
            
            # Combine context with query if available
            enhanced_query = (
                f"{context}\n\nCurrent Query: {query}"
                if context else query
            )
            
            # Perform search with enhanced query
            results = self.search_documents(enhanced_query)
            
            # Add query and context to results
            results["query"] = query
            results["context_used"] = bool(context)
            results["history_messages"] = len(chat_history)
            
            return results
            
        except Exception as e:
            logger.error(f"Error processing query with context: {str(e)}")
            raise
    
    @classmethod
    def initialize_sources(cls) -> None:
        """Initialize all documentation sources."""
        pipeline = cls()
        
        for source in DocSource:
            try:
                logger.info(f"Initializing {source.value} documentation")
                pipeline.process_documents(source)
            except Exception as e:
                logger.error(f"Error initializing {source.value}: {str(e)}")
                continue
                
        logger.info("Completed source initialization")