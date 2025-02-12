# app/middleware/auth.py
from fastapi import Request, WebSocket, HTTPException
from fastapi.responses import JSONResponse
from ..utils.logger import setup_logger
import json
import time
from typing import Optional

logger = setup_logger(__name__)
TOKEN_EXPIRE = 600

async def verify_token(token: str, app) -> Optional[dict]:
    redis_key = f"auth_token:{token}"
    cached_user = await app.state.redis.get(redis_key)
    
    if cached_user:
        return json.loads(cached_user)

    try:
        user = await app.state.supabase.auth.getUser(token)
        if user:
            user_data = {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "last_sign_in": str(user.last_sign_in)
            }
            
            async with app.state.redis.pipeline() as pipe:
                await pipe.set(redis_key, json.dumps(user_data))
                await pipe.expire(redis_key, TOKEN_EXPIRE)
                await pipe.execute()
                
            logger.info(f"User authenticated: {user_data['email']}")
            return user_data
    except Exception as e:
        logger.error(f"Auth failed: {str(e)}")
        return None

async def auth_middleware(request: Request, call_next):
    start_time = time.perf_counter()
    
    if request.url.path in ["/api/v1/health/health", "/docs", "/redoc", "/openapi.json"]:
        response = await call_next(request)
        process_time = time.perf_counter() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response

    try:
        if request.headers.get("upgrade", "").lower() == "websocket":
            # For WebSocket requests, we'll handle authentication in the WebSocket route
            return await call_next(request)

        token = request.headers.get("Authorization")
        if not token:
            return JSONResponse(
                status_code=401,
                content={"detail": "No token provided"}
            )

        user = await verify_token(token, request.app)
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

async def verify_websocket(websocket: WebSocket) -> bool:
    token = websocket.headers.get("Authorization") or websocket.query_params.get("token")

    if not token:
        await websocket.close(code=4001, reason="No token provided")
        return False

    user = await verify_token(token, websocket.app)
    if not user:
        await websocket.close(code=4001, reason="Invalid token")
        return False

    websocket.state.user = user
    return True

def requires_auth(func):
    async def wrapper(websocket: WebSocket, *args, **kwargs):
        if await verify_websocket(websocket):
            return await func(websocket, *args, **kwargs)
    return wrapper
