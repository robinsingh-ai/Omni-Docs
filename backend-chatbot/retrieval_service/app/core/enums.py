from enum import Enum, auto

class DocSource(Enum):
    """Documentation sources"""
    FLUTTER = "flutter"
    NEXTJS = "nextjs"
    
    @property
    def sitemap_url(self) -> str:
        """Get sitemap URL for the source"""
        urls = {
            DocSource.FLUTTER: "https://docs.flutter.dev/sitemap.xml",
            DocSource.NEXTJS: "https://nextjs.org/sitemap.xml"
        }
        return urls[self]
    
    @property
    def data_dir(self) -> str:
        """Get data directory for the source"""
        return f"data/{self.value}_docs"

class ModelType(Enum):
    """Types of embedding models"""
    DENSE = auto()
    SPARSE = auto()
    RERANKER = auto()

class ProcessingStep(Enum):
    """Steps in the processing pipeline"""
    FETCH = auto()
    CLEAN = auto()
    CHUNK = auto()
    EMBED = auto()
    INDEX = auto()