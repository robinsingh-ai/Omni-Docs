# app/middleware/auth.py
from fastapi import Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from ..utils.logger import setup_logger
from ..dependencies import get_redis, get_supabase
import json
import time
from typing import Optional

logger = setup_logger(__name__)
TOKEN_EXPIRE = 600

async def verify_token(token: str, redis, supabase) -> Optional[dict]:
   redis_key = f"auth_token:{token}"
   cached_user = await redis.get(redis_key)
   
   if cached_user:
       return json.loads(cached_user)

   try:
       user = await supabase.auth.getUser(token)
       if user:
           user_data = {
               "id": user.id, 
               "email": user.email,
               "role": user.role,
               "last_sign_in": str(user.last_sign_in)
           }
           
           async with redis.pipeline() as pipe:
               await pipe.set(redis_key, json.dumps(user_data))
               await pipe.expire(redis_key, TOKEN_EXPIRE)
               await pipe.execute()
               
           logger.info(f"User authenticated: {user_data['email']}")
           return user_data
   except Exception as e:
       logger.error(f"Auth failed: {str(e)}")
       return None

async def auth_middleware(
   request: Request,
   call_next,
   redis=Depends(get_redis),
   supabase=Depends(get_supabase)
):
   start_time = time.perf_counter()
   
   if request.url.path in ["/api/v1/health/health", "/docs", "/redoc", "/openapi.json"]:
       response = await call_next(request)
       process_time = time.perf_counter() - start_time
       response.headers["X-Process-Time"] = str(process_time)
       return response

   try:
       token = request.headers.get("Authorization")
       if not token:
           return JSONResponse(
               status_code=401,
               content={"detail": "No token provided"}
           )

       user = await verify_token(token, redis, supabase)
       if not user:
           return JSONResponse(
               status_code=401,
               content={"detail": "Invalid token"}
           )

       request.state.user = user
       response = await call_next(request)
       
       process_time = time.perf_counter() - start_time
       response.headers["X-Process-Time"] = str(process_time)
       
       return response

   except Exception as e:
       logger.error(f"Middleware error: {str(e)}")
       return JSONResponse(
           status_code=500,
           content={"detail": "Internal server error"}
       )