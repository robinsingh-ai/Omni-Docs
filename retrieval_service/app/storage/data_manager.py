import torch
import faiss
import json
import pickle
from pathlib import Path
from typing import Dict, Any, Optional
from ..core.config import Config
from ..core.singleton import Singleton
from ..core.enums import DocSource
from ..utils.logger import logger

class DataManager(metaclass=Singleton):
    """Manage saving and loading of model data and embeddings."""
    
    def __init__(self):
        self.config = Config()
        
    def get_source_dir(self, source: DocSource) -> Path:
        """Get data directory for a specific source."""
        data_dir = Path(self.config.get_data_dir(source.value))
        data_dir.mkdir(parents=True, exist_ok=True)
        return data_dir
    
    def save_data(
        self,
        source: DocSource,
        chunks: list,
        chunk_to_url: Dict[str, str],
        sparse_embeddings: list,
        dense_embeddings: torch.Tensor,
        dense_index: faiss.Index
    ) -> None:
        """Save all components for a documentation source."""
        try:
            data_dir = self.get_source_dir(source)
            logger.info(f"Saving data for {source.value} to {data_dir}")
            
            # Save text chunks
            with open(data_dir / 'chunks.pkl', 'wb') as f:
                pickle.dump(chunks, f)
            
            # Save URL mappings
            with open(data_dir / 'chunk_to_url.json', 'w') as f:
                json.dump(chunk_to_url, f)
            
            # Save sparse embeddings
            with open(data_dir / 'sparse_embeddings.pkl', 'wb') as f:
                pickle.dump(sparse_embeddings, f)
            
            # Save dense embeddings
            torch.save(dense_embeddings, data_dir / 'dense_embeddings.pt')
            
            # Save FAISS index
            faiss.write_index(dense_index, str(data_dir / 'dense_index.faiss'))
            
            logger.info(f"Successfully saved all data for {source.value}")
            
        except Exception as e:
            logger.error(f"Error saving data for {source.value}: {str(e)}")
            raise
    
    def load_data(self, source: DocSource) -> Dict[str, Any]:
        """Load all components for a documentation source."""
        try:
            data_dir = self.get_source_dir(source)
            logger.info(f"Loading data for {source.value} from {data_dir}")
            
            # Check for required files
            required_files = [
                'chunks.pkl',
                'chunk_to_url.json',
                'sparse_embeddings.pkl',
                'dense_embeddings.pt',
                'dense_index.faiss'
            ]
            
            for file in required_files:
                if not (data_dir / file).exists():
                    raise FileNotFoundError(
                        f"Missing required file {file} for {source.value}"
                    )
            
            # Load components
            with open(data_dir / 'chunks.pkl', 'rb') as f:
                chunks = pickle.load(f)
                
            with open(data_dir / 'chunk_to_url.json', 'r') as f:
                chunk_to_url = json.load(f)
                
            with open(data_dir / 'sparse_embeddings.pkl', 'rb') as f:
                sparse_embeddings = pickle.load(f)
                
            dense_embeddings = torch.load(
                data_dir / 'dense_embeddings.pt',
                map_location=self.config.device
            )
            
            dense_index = faiss.read_index(str(data_dir / 'dense_index.faiss'))
            
            logger.info(f"Successfully loaded all data for {source.value}")
            
            return {
                "chunks": chunks,
                "chunk_to_url": chunk_to_url,
                "sparse_embeddings": sparse_embeddings,
                "dense_embeddings": dense_embeddings,
                "dense_index": dense_index
            }
            
        except Exception as e:
            logger.error(f"Error loading data for {source.value}: {str(e)}")
            raise
    
    def check_data_exists(self, source: DocSource) -> bool:
        """Check if all required data exists for a source."""
        data_dir = self.get_source_dir(source)
        required_files = [
            'chunks.pkl',
            'chunk_to_url.json',
            'sparse_embeddings.pkl',
            'dense_embeddings.pt',
            'dense_index.faiss'
        ]
        
        return all((data_dir / file).exists() for file in required_files)
        
    def clear_data(self, source: DocSource) -> None:
        """Clear all data for a documentation source."""
        try:
            data_dir = self.get_source_dir(source)
            
            if data_dir.exists():
                for file in data_dir.glob('*'):
                    file.unlink()
                data_dir.rmdir()
                
            logger.info(f"Cleared all data for {source.value}")
            
        except Exception as e:
            logger.error(f"Error clearing data for {source.value}: {str(e)}")
            raise