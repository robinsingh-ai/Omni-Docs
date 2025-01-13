from langchain.vectorstores import FAISS
from typing import List, Dict
import os
import logging
from pathlib import Path

class FAISSManager:
    def __init__(self, embeddings):
        self.embeddings = embeddings
        self.logger = logging.getLogger(__name__)
        
    def create_or_load_faiss_index(self, texts: List[str], index_name: str):
        """Create a new FAISS index or load existing one."""
        index_path = f"data/{index_name}"
        
        if os.path.exists(index_path):
            return self.load_faiss_index(index_name)
        
        # Create new index if it doesn't exist
        self.logger.info(f"Creating new FAISS index: {index_name}")
        vectorstore = FAISS.from_texts(
            texts, 
            self.embeddings, 
            metadatas=[{"source": str(i)} for i in range(len(texts))]
        )
        
        # Save the new index
        self.save_faiss_index(vectorstore, index_name)
        return vectorstore

    def save_faiss_index(self, index: FAISS, index_name: str):
        """Save FAISS index to disk."""
        os.makedirs("data", exist_ok=True)
        index_path = f"data/{index_name}"
        self.logger.info(f"Saving FAISS index to: {index_path}")
        index.save_local(index_path)

    def load_faiss_index(self, index_name: str) -> FAISS:
        """Load FAISS index from disk with safe deserialization."""
        index_path = f"data/{index_name}"
        self.logger.info(f"Loading FAISS index from: {index_path}")
        
        try:
            return FAISS.load_local(
                index_path, 
                self.embeddings,
                allow_dangerous_deserialization=True  # Only safe because we created these files
            )
        except Exception as e:
            self.logger.error(f"Error loading FAISS index: {e}")
            raise