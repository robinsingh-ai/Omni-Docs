# app/core/path_setup.py
import os
import sys

def setup_paths():
    """Add necessary paths to Python's sys.path"""
    # Get the path to the backend-chatbot directory
    current_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Get the parent directory containing both backend-chatbot and retrieval_service
    parent_dir = os.path.dirname(current_dir)
    
    # Add retrieval_service to path
    retrieval_service_path = os.path.join(parent_dir, 'retrieval_service')
    
    if os.path.exists(retrieval_service_path):
        if retrieval_service_path not in sys.path:
            sys.path.insert(0, retrieval_service_path)
            print(f"Added retrieval service path: {retrieval_service_path}")
    else:
        raise ImportError(f"Retrieval service not found at {retrieval_service_path}")