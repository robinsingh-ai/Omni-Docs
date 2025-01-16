# app/core/exceptions.py
class ModelError(Exception):
    """Base exception for model-related errors."""
    pass

class ModelNotFoundError(ModelError):
    """Exception raised when a requested model is not found."""
    pass

class NoAvailableModelsError(ModelError):
    """Exception raised when no models are available."""
    pass