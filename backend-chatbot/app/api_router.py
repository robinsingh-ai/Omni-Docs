# app/api_router.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes import crawl, query, status

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with proper prefixes and tags
app.include_router(crawl, prefix="/api/v1", tags=["crawl"])
app.include_router(query, prefix="/api/v1", tags=["query"])
app.include_router(status, prefix="/api/v1", tags=["status"])