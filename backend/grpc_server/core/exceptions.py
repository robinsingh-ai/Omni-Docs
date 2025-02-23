class ModelNotFoundError(Exception):
    """Raised when requested model is not found."""
    pass

class NoAvailableModelsError(Exception):
    """Raised when no models are available."""
    pass

class SourceNotFoundError(Exception):
    """Raised when requested source is not found."""
    pass

class ModelInitializationError(Exception):
    """Raised when model initialization fails."""
    pass

class SearchError(Exception):
    """Raised when document search fails."""
    pass 