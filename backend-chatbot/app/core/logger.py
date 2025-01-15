# app/core/logger.py
import logging
import sys
from app.core.config import get_settings

settings = get_settings()

def setup_logger(name: str) -> logging.Logger:
    """Configure and return a logger instance."""
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
        # Set log level from environment
        log_level = getattr(logging, settings.LOG_LEVEL.upper())
        logger.setLevel(log_level)
    
    return logger