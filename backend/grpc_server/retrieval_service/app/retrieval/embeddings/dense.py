import torch
import numpy as np
import faiss
from typing import List, Optional
from tqdm import tqdm
from fastembed import TextEmbedding
from ...core.config import Config
from ...core.singleton import Singleton
from ...utils.logger import logger

class DenseEmbedder(metaclass=Singleton):
    """Handle dense embeddings using FastEmbed."""
    
    def __init__(self):
        self.config = Config()
        self.model_name = self.config.model_configs["dense"]["model_name"]
        self.device = self.config.device
        
        logger.info(f"Initializing dense embedder with model {self.model_name} on {self.device}")
        self.model = TextEmbedding(model_name=self.model_name)
        
        # Storage for embeddings and index
        self.embeddings: Optional[torch.Tensor] = None
        self.index: Optional[faiss.Index] = None
    
    def embed_texts(self, texts: List[str]) -> torch.Tensor:
        """Generate dense embeddings for a list of texts."""
        try:
            logger.info(f"Generating dense embeddings for {len(texts)} texts")
            
            # Generate embeddings
            embeddings = list(tqdm(
                self.model.embed(texts),
                desc="Generating dense embeddings",
                total=len(texts)
            ))
            
            # Convert to numpy array with proper dtype
            dense_numpy = np.stack(embeddings).astype(np.float32)
            
            # Convert to tensor and move to device
            self.embeddings = torch.tensor(
                dense_numpy,
                device=self.device,
                dtype=torch.float32
            )
            
            # Build FAISS index
            self.build_index(dense_numpy)
            
            return self.embeddings
            
        except Exception as e:
            logger.error(f"Error generating dense embeddings: {str(e)}")
            raise
    
    def build_index(self, embeddings: np.ndarray) -> None:
        """Build FAISS index for fast similarity search."""
        try:
            logger.info("Building FAISS index...")
            self.index = faiss.IndexFlatIP(embeddings.shape[1])
            self.index.add(embeddings.astype('float32'))
            logger.info("FAISS index built successfully")
            
        except Exception as e:
            logger.error(f"Error building FAISS index: {str(e)}")
            raise
    
    def search(self, query: str, k: int = 50) -> tuple:
        """Search for similar texts using dense embeddings."""
        if self.index is None:
            raise ValueError("Index not built. Call embed_texts first.")
            
        try:
            # Generate query embedding
            query_embedding = np.array(
                list(self.model.embed([query]))[0]
            ).astype(np.float32)
            
            # Perform search
            scores, indices = self.index.search(
                query_embedding.reshape(1, -1), 
                k
            )
            
            return scores[0], indices[0]
            
        except Exception as e:
            logger.error(f"Error performing dense search: {str(e)}")
            raise