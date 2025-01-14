# utils/faiss_utils.py
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from typing import List, Dict
import os
import logging
from pathlib import Path

class FAISSManager:
    def __init__(self, embeddings):
        self.embeddings = embeddings
        self.logger = logging.getLogger(__name__)
    
    def create_index_from_documents(self, documents: List[Document], index_name: str) -> FAISS:
        """Create a new FAISS index from documents."""
        self.logger.info(f"Creating new FAISS index: {index_name}")
        return FAISS.from_documents(documents, self.embeddings)

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
                allow_dangerous_deserialization=True
            )
        except Exception as e:
            self.logger.error(f"Error loading FAISS index: {e}")
            raise