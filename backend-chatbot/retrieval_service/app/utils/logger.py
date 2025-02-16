import logging
import sys
from pathlib import Path
from typing import Optional
from tqdm import tqdm

class TqdmLoggingHandler(logging.Handler):
    """Custom logging handler that writes to tqdm progress bar."""
    def emit(self, record):
        try:
            msg = self.format(record)
            tqdm.write(msg)
            self.flush()
        except Exception:
            self.handleError(record)

def setup_logger(name: Optional[str] = None) -> logging.Logger:
    """Configure logging with tqdm compatibility"""
    # Create logger
    logger = logging.getLogger(name or __name__)
    logger.setLevel(logging.INFO)
    
    # Remove existing handlers
    logger.handlers = []
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console handler with tqdm compatibility
    console_handler = TqdmLoggingHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler for errors
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    error_handler = logging.FileHandler(log_dir / "errors.log")
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    logger.addHandler(error_handler)
    
    return logger

# Initialize default logger
logger = setup_logger("retrieval_pipeline")