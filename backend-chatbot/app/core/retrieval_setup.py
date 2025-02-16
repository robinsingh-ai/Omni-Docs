# # app/core/retrieval_setup.py
# from app.core.logger import setup_logger

# logger = setup_logger(__name__)

# try:
#     from retrieval_service.app.core.enums import DocSource
#     from retrieval_service.app.retrieval.base import RetrievalPipeline
#     logger.info("Successfully imported from retrieval_service")
# except ImportError as e:
#     logger.error(f"Failed to import from retrieval_service: {e}")
#     raise

# __all__ = ['DocSource', 'RetrievalPipeline']