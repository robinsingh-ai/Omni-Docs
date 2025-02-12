from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import router 
from app.config import get_settings
from app.utils.logger import setup_logger
from app.services.redis import RedisClient
from app.services.supabase import SupabaseClient
from app.middleware.auth import auth_middleware

import os

logger = setup_logger("main")
os.makedirs("logs", exist_ok=True)

# Store service clients globally
redis_client = None 
supabase_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
   global redis_client, supabase_client
   settings = get_settings()
   
   # Initialize services at startup
   try:
       redis_client = RedisClient(settings.REDIS_HOST, settings.REDIS_PORT, settings.REDIS_DB)
       app.state.redis = redis_client
       logger.info("Redis connection established at startup")
   except Exception as e:
       logger.error(f"Failed to connect to Redis at startup: {str(e)}")
       raise

   try:
       supabase_client = SupabaseClient(settings.SUPABASE_URL, settings.SUPABASE_KEY)
       app.state.supabase = supabase_client
       logger.info("Supabase connection established at startup")
   except Exception as e:
       logger.error(f"Failed to connect to Supabase at startup: {str(e)}")
       raise

   logger.info("Starting up FastAPI application")
   yield
   
   # Cleanup
   logger.info("Shutting down FastAPI application and closing connections")
   if hasattr(app.state, "redis"):
       del app.state.redis
   if hasattr(app.state, "supabase"):
       del app.state.supabase

app = FastAPI(
   title="Chat Backend API",
   description="FastAPI backend for chat application",
   version="1.0.0",
   lifespan=lifespan
)


app.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)

# will handle all the https api calls
app.middleware("http")(auth_middleware)


# for web socket, will use @app.websocket("/ws")
# @requires_auth

app.include_router(router, prefix="/api/v1")

if __name__ == "__main__":
   import uvicorn
   uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)