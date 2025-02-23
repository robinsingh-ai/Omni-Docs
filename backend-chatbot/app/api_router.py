# app/api_router.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logger import setup_logger
from app.routes import crawl, query, status, models
from app.services.redis import RedisClient
from app.services.supabase import SupabaseClient
from app.routes.grpc_routes import router as grpc_router  # Import the router instance

settings = get_settings()
logger = setup_logger(__name__)

# Store service instances
redis_client = None
supabase_client = None

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for documentation chatbot with model selection and streaming capabilities",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize services during app startup"""
    global redis_client, supabase_client
    
    try:
        # Initialize Redis
        logger.info("Initializing Redis connection...")
        redis_client = RedisClient(settings)
        await redis_client.ping()  # Test connection
        logger.info("✅ Successfully connected to Redis")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize Redis: {str(e)}")
        raise
        
    try:
        # Initialize Supabase
        logger.info("Initializing Supabase connection...")
        supabase_client = SupabaseClient(settings)
        await supabase_client.health_check()  # Test connection
        logger.info("✅ Successfully connected to Supabase")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize Supabase: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup services during app shutdown"""
    global redis_client, supabase_client
    
    if redis_client:
        try:
            await redis_client.close()
            logger.info("Redis connection closed")
        except Exception as e:
            logger.error(f"Error closing Redis connection: {str(e)}")
    
    if supabase_client:
        try:
            await supabase_client.close()
            logger.info("Supabase connection closed")
        except Exception as e:
            logger.error(f"Error closing Supabase connection: {str(e)}")

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

app.include_router(grpc_router)

# Root endpoint for API information
@app.get("/", tags=["root"])
async def root():
    """Get API information and available endpoints."""
    return {
        "name": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "operational",
        "services": {
            "redis": bool(redis_client),
            "supabase": bool(supabase_client)
        },
        "endpoints": {
            "documentation": "/docs",
            "api_base": "/api/v1",
            "available_models": "/api/v1/models",
            "health_check": "/api/v1/status"
        }
    }