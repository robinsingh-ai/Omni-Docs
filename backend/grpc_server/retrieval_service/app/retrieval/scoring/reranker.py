from typing import List
from fastembed.rerank.cross_encoder import TextCrossEncoder
from ...core.config import Config
from ...core.singleton import Singleton
from ...utils.logger import logger

class Reranker(metaclass=Singleton):
    """Rerank search results using cross-encoder."""
    
    def __init__(self):
        self.config = Config()
        self.model_name = self.config.model_configs["reranker"]["model_name"]
        
        logger.info(f"Initializing reranker with model {self.model_name}")
        self.model = TextCrossEncoder(model_name=self.model_name)
    
    def rerank(self, query: str, texts: List[str], top_k: int = 10) -> List[float]:
        """Rerank texts based on relevance to query."""
        try:
            if not texts:
                return []
                
            logger.info(f"Reranking {len(texts)} texts")
            
            # Get reranking scores
            rerank_scores = list(self.model.rerank(query, texts))
            
            # Return top_k scores
            return rerank_scores[:top_k]
            
        except Exception as e:
            logger.error(f"Error during reranking: {str(e)}")
            raise