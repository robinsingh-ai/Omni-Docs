# app/routes/__init__.py
from .crawl import router as crawl_router
from .query import router as query_router
from .status import router as status_router
from .models import router as models_router

# Export the routers
crawl = crawl_router
query = query_router
status = status_router
models = models_router