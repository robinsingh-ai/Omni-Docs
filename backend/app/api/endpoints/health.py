from fastapi import APIRouter, Depends
from ...utils.logger import setup_logger
from ...dependencies import get_redis, get_supabase

logger = setup_logger(__name__)
router = APIRouter()

@router.get("/health")
async def health_check(
   redis=Depends(get_redis),
   supabase=Depends(get_supabase)
):
   health_status = {
       "status": "healthy",
       "services": {
           "api": "up",
           "redis": "up", 
           "supabase": "up"
       }
   }
   
   try:
       redis.client.ping()
   except Exception as e:
       logger.error(f"Redis health check failed: {str(e)}")
       health_status["services"]["redis"] = "down"
   
   try:
       if not supabase.client:
           raise Exception("Supabase client not initialized")
   except Exception as e:
       logger.error(f"Supabase health check failed: {str(e)}")
       health_status["services"]["supabase"] = "down"
   
   return health_status