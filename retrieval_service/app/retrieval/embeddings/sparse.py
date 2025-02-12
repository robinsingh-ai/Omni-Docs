from typing import List, Dict
from tqdm import tqdm
from fastembed import SparseTextEmbedding
from ...core.config import Config
from ...core.singleton import Singleton
from ...utils.logger import logger

class SparseEmbedder(metaclass=Singleton):
    """Handle sparse embeddings using FastEmbed."""
    
    def __init__(self):
        self.config = Config()
        self.model_name = self.config.model_configs["sparse"]["model_name"]
        
        logger.info(f"Initializing sparse embedder with model {self.model_name}")
        self.model = SparseTextEmbedding(model_name=self.model_name)
        
        # Storage for embeddings
        self.embeddings = []
    
    def embed_texts(self, texts: List[str]) -> List:
        """Generate sparse embeddings for a list of texts."""
        try:
            logger.info(f"Generating sparse embeddings for {len(texts)} texts")
            
            self.embeddings = list(tqdm(
                self.model.embed(texts),
                desc="Generating sparse embeddings",
                total=len(texts)
            ))
            
            return self.embeddings
            
        except Exception as e:
            logger.error(f"Error generating sparse embeddings: {str(e)}")
            raise
    
    def compute_sparse_scores(self, query: str, indices: List[int]) -> List[float]:
        """Compute sparse similarity scores for given indices."""
        try:
            # Generate query embedding
            query_sparse = list(self.model.embed([query]))[0]
            sparse_scores = []
            
            # Compute scores for selected documents
            for idx in indices:
                doc_emb = self.embeddings[idx]
                
                # Compute dot product for matching indices
                score = sum(
                    query_sparse.values[i] * doc_emb.values[doc_emb.indices == idx][0]
                    for i, idx in enumerate(query_sparse.indices)
                    if idx in doc_emb.indices
                )
                sparse_scores.append(score)
            
            return sparse_scores
            
        except Exception as e:
            logger.error(f"Error computing sparse scores: {str(e)}")
            raise