import logging
import sys
from typing import Optional
from functools import lru_cache
from core.config import get_settings

@lru_cache()
def setup_logger(name: Optional[str] = None) -> logging.Logger:
    """Set up and return a configured logger instance."""
    settings = get_settings()
    
    # Create logger
    logger = logging.getLogger(name or __name__)
    
    # Set log level from settings
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(log_level)
    
    # Create handlers if they don't exist
    if not logger.handlers:
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(log_level)
        
        # Format
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        console_handler.setFormatter(formatter)
        
        # Add handler
        logger.addHandler(console_handler)
        
        # Prevent propagation to root logger
        logger.propagate = False
    
    return logger 