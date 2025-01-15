# app/utils/faiss_utils.py
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from typing import List
import os
from app.core.logger import setup_logger
from app.core.config import get_settings

settings = get_settings()

class FAISSManager:
    def __init__(self, embeddings):
        self.embeddings = embeddings
        self.logger = setup_logger(__name__)
    
    def save_faiss_index(self, index: FAISS, index_name: str):
        """Save FAISS index to disk."""
        os.makedirs(settings.DATA_DIR, exist_ok=True)
        index_path = os.path.join(settings.DATA_DIR, index_name)
        self.logger.info(f"Saving FAISS index to: {index_path}")
        index.save_local(index_path)

    def load_faiss_index(self, index_name: str) -> FAISS:
        """Load FAISS index from disk."""
        index_path = os.path.join(settings.DATA_DIR, index_name)
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