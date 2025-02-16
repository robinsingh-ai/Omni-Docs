import torch
import nltk
from typing import List, Tuple, Dict, Set
from nltk.corpus import stopwords
from ...core.config import Config
from ...core.singleton import Singleton
from ...utils.logger import logger

class RelevanceChecker(metaclass=Singleton):
    """Check relevance of search results."""
    
    def __init__(self):
        self.config = Config()
        self.threshold = self.config.scoring_configs["relevance_threshold"]
        self.term_overlap_threshold = self.config.scoring_configs["term_overlap_threshold"]
        self.device = self.config.device
        
        # Initialize NLTK resources
        nltk.download('stopwords', quiet=True)
        self.stop_words = set(stopwords.words('english'))
    
    def normalize_text(self, text: str) -> Set[str]:
        """Normalize text for term matching."""
        # Remove punctuation and convert to lowercase
        text = ''.join([c.lower() if c.isalnum() else ' ' for c in text])
        
        # Remove stopwords and create set of terms
        return set(
            word for word in text.split() 
            if word not in self.stop_words
        )
    
    def compute_term_overlap(self, query: str, text: str) -> float:
        """Compute term overlap between query and text."""
        query_terms = self.normalize_text(query)
        doc_terms = self.normalize_text(text)
        
        if not query_terms:
            return 0.0
            
        return len(query_terms & doc_terms) / len(query_terms)
    
    def compute_semantic_similarity(
        self,
        query_embedding: torch.Tensor,
        doc_embedding: torch.Tensor
    ) -> float:
        """Compute semantic similarity between query and document."""
        # Convert to tensor if needed and move to correct device
        if not isinstance(query_embedding, torch.Tensor):
            query_embedding = torch.tensor(query_embedding, device=self.device)
        if not isinstance(doc_embedding, torch.Tensor):
            doc_embedding = torch.tensor(doc_embedding, device=self.device)
            
        # Ensure they're float32
        query_embedding = query_embedding.float()
        doc_embedding = doc_embedding.float()
        
        return torch.nn.functional.cosine_similarity(
            query_embedding.unsqueeze(0),
            doc_embedding.unsqueeze(0)
        ).item()
    
    def check_relevance(
        self,
        query: str,
        results: List[Dict],
        query_embedding: torch.Tensor,
        doc_embeddings: torch.Tensor
    ) -> Tuple[bool, float]:
        """Check if search results are relevant to the query."""
        if not results:
            return False, 0.0
        
        # Get top result
        top_result = results[0]
        top_text = top_result['text']
        top_idx = top_result['index']
        
        # Compute semantic similarity
        similarity = self.compute_semantic_similarity(
            query_embedding,
            doc_embeddings[top_idx]
        )
        
        # Compute term overlap
        term_overlap = self.compute_term_overlap(query, top_text)
        
        # Log relevance metrics
        logger.info(
            f"Relevance metrics - "
            f"Similarity: {similarity:.3f}, "
            f"Term overlap: {term_overlap:.3f}"
        )
        
        # Check against thresholds
        is_relevant = (
            similarity >= self.threshold and 
            term_overlap >= self.term_overlap_threshold
        )
        
        return is_relevant, similarity