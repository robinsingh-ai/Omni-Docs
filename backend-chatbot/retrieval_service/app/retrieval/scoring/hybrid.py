import numpy as np
from typing import List, Dict
from ...core.config import Config
from ...core.singleton import Singleton
from ...utils.logger import logger
from ..embeddings.dense import DenseEmbedder
from ..embeddings.sparse import SparseEmbedder
from .reranker import Reranker

class HybridSearch(metaclass=Singleton):
    """Combine dense and sparse search with reranking."""
    
    def __init__(self):
        self.config = Config()
        self.dense_embedder = DenseEmbedder()
        self.sparse_embedder = SparseEmbedder()
        self.reranker = Reranker()  # Initialize the reranker
        
        # Load scoring weights from config
        self.dense_weight = self.config.scoring_configs["dense_weight"]
        self.sparse_weight = self.config.scoring_configs["sparse_weight"]
        self.rerank_weight = self.config.scoring_configs["rerank_weight"]
    
    @staticmethod
    def normalize_scores(scores: List[float]) -> List[float]:
        """Normalize scores to [0, 1] range."""
        if not scores:
            return []
            
        scores = np.array(scores, dtype=np.float32)
        
        if scores.size == 0:
            return []
        
        if np.ptp(scores) == 0:  # All scores are the same
            return np.ones_like(scores).tolist()
        
        return ((scores - np.min(scores)) / np.ptp(scores)).tolist()
    
    def search(
        self, 
        query: str,
        texts: List[str],
        k: int = 50
    ) -> List[Dict]:
        """Perform hybrid search with reranking."""
        try:
            # Dense search
            dense_scores, indices = self.dense_embedder.search(query, k)
            
            # Sparse scoring for top results
            sparse_scores = self.sparse_embedder.compute_sparse_scores(
                query, 
                indices.tolist()
            )
            
            # Normalize scores
            norm_dense = self.normalize_scores(dense_scores.tolist())
            norm_sparse = self.normalize_scores(sparse_scores)
            
            # Combine dense and sparse scores
            combined_docs = []
            selected_texts = []
            
            for i, idx in enumerate(indices):
                combined_score = (
                    self.dense_weight * norm_dense[i] +
                    self.sparse_weight * norm_sparse[i]
                )
                
                combined_docs.append({
                    "index": idx,
                    "text": texts[idx],
                    "scores": {
                        "dense": norm_dense[i],
                        "sparse": norm_sparse[i],
                        "combined": combined_score
                    }
                })
                selected_texts.append(texts[idx])
            
            # Sort by combined score and take top 20 for reranking
            combined_docs.sort(key=lambda x: x["scores"]["combined"], reverse=True)
            rerank_candidates = [doc["text"] for doc in combined_docs[:20]]
            
            # Rerank top candidates using the reranker instance
            rerank_scores = self.reranker.rerank(query, rerank_candidates)
            norm_rerank = self.normalize_scores(rerank_scores)
            
            # Final scoring
            final_results = []
            for doc, rerank_score in zip(combined_docs[:10], norm_rerank[:10]):
                final_score = (
                    (1 - self.rerank_weight) * doc["scores"]["combined"] +
                    self.rerank_weight * rerank_score
                )
                
                doc["scores"]["rerank"] = rerank_score
                doc["scores"]["final"] = final_score
                final_results.append(doc)
            
            # Sort by final score
            final_results.sort(key=lambda x: x["scores"]["final"], reverse=True)
            
            return final_results
            
        except Exception as e:
            logger.error(f"Error in hybrid search: {str(e)}")
            raise