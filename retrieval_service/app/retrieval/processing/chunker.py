from typing import List, Dict
import nltk
from nltk.tokenize import word_tokenize
from ...core.config import Config
from ...utils.logger import logger

# Download required NLTK data
nltk.download('punkt', quiet=True)

class TextChunker:
    """Split text into overlapping chunks."""
    
    def __init__(self):
        self.config = Config()
        self.chunk_size = self.config.processing_configs["chunk_size"]
        self.overlap = self.config.processing_configs["chunk_overlap"]
    
    def chunk_text(self, text: str) -> List[str]:
        """Split text into overlapping chunks based on tokens."""
        try:
            # Tokenize the text
            tokens = word_tokenize(text)
            chunks = []
            start = 0
            
            while start < len(tokens):
                # Calculate end position with overlap
                end = start + self.chunk_size
                chunk_tokens = tokens[start:end]
                
                # Join tokens back into text
                chunk = ' '.join(chunk_tokens)
                chunks.append(chunk)
                
                # Move start position considering overlap
                start = end - self.overlap if end - self.overlap > start else start + 1
            
            return chunks
            
        except Exception as e:
            logger.error(f"Error chunking text: {str(e)}")
            return []
    
    def chunk_documents(self, documents: Dict[str, str]) -> Dict[str, List[str]]:
        """Process multiple documents into chunks."""
        chunked_docs = {}
        
        for url, content in documents.items():
            chunks = self.chunk_text(content)
            if chunks:
                chunked_docs[url] = chunks
            else:
                logger.warning(f"No chunks generated for {url}")
        
        total_chunks = sum(len(chunks) for chunks in chunked_docs.values())
        logger.info(f"Generated {total_chunks} chunks from {len(documents)} documents")
        
        return chunked_docs
    
    def update_chunk_size(self, new_size: int, new_overlap: int) -> None:
        """Update chunking parameters."""
        self.chunk_size = new_size
        self.overlap = new_overlap
        logger.info(f"Updated chunk size to {new_size} and overlap to {new_overlap}")

# Initialize chunker with default settings
default_chunker = TextChunker()