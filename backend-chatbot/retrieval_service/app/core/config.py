import torch
from pathlib import Path
from typing import Dict, Any
from .singleton import Singleton

class Config(metaclass=Singleton):
    """Configuration management for the retrieval pipeline"""
    
    def __init__(self):
        # Determine device - prioritize MPS for M1 Macs
        self.device = 'mps' if torch.backends.mps.is_available() else 'cpu'
        
        self.model_configs = {
            "dense": {
                "model_name": "BAAI/bge-small-en-v1.5",
                "device": self.device
            },
            "sparse": {
                "model_name": "prithivida/Splade_PP_en_v1"
            },
            "reranker": {
                "model_name": "Xenova/ms-marco-MiniLM-L-6-v2"
            }
        }
        
        self.processing_configs = {
            "chunk_size": 512,
            "chunk_overlap": 128,
            "request_timeout": 15,
            "max_retries": 3
        }
        
        self.scoring_configs = {
            "dense_weight": 0.7,
            "sparse_weight": 0.3,
            "rerank_weight": 0.5,
            "relevance_threshold": 0.6,
            "term_overlap_threshold": 0.25
        }
        
        # Create base data directory
        self.base_data_dir = Path("data")
        self.base_data_dir.mkdir(exist_ok=True)
        
        print(f"Using device: {self.device}")
    
    def get_data_dir(self, source: str) -> Path:
        """Get data directory for a specific source"""
        data_dir = self.base_data_dir / f"{source}_docs"
        data_dir.mkdir(exist_ok=True)
        return data_dir
    
    def update_config(self, section: str, updates: Dict[str, Any]) -> None:
        """Update configuration settings"""
        if section in ["model_configs", "processing_configs", "scoring_configs"]:
            getattr(self, section).update(updates)
        else:
            raise ValueError(f"Unknown config section: {section}")
            
    @property
    def device_config(self) -> Dict[str, Any]:
        """Get device-specific configuration"""
        return {
            "device": self.device,
            "device_name": "Apple M1" if self.device == "mps" else "CPU",
            "torch_version": torch.__version__,
            "mps_available": torch.backends.mps.is_available(),
        }