# app/api_router.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes import crawl, query, status, models

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for documentation chatbot with model selection and streaming capabilities",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with proper prefixes and tags
app.include_router(
    crawl,
    prefix="/api/v1",
    tags=["crawl"],
    responses={
        500: {"description": "Internal server error"},
        503: {"description": "Service temporarily unavailable"}
    }
)

app.include_router(
    query,
    prefix="/api/v1",
    tags=["query"],
    responses={
        404: {"description": "Model not found"},
        503: {"description": "Service temporarily unavailable"}
    }
)

app.include_router(
    status,
    prefix="/api/v1",
    tags=["status"],
    responses={
        503: {"description": "Service unhealthy"}
    }
)

app.include_router(
    models,
    prefix="/api/v1",
    tags=["models"],
    responses={
        503: {"description": "No models available"},
        500: {"description": "Internal server error"}
    }
)

# Root endpoint for API information
@app.get("/", tags=["root"])
async def root():
    """Get API information and available endpoints."""
    return {
        "name": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "documentation": "/docs",
            "api_base": "/api/v1",
            "available_models": "/api/v1/models",
            "health_check": "/api/v1/status"
        }
    }