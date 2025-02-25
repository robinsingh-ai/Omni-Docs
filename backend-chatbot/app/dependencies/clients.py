from fastapi import Request, HTTPException, Depends

def get_redis_client(request: Request):
    """
    Dependency to get the Redis client from app state.
    Raises an HTTPException if the client is not initialized.
    """
    if not hasattr(request.app.state, "redis_client"):
        raise HTTPException(status_code=503, detail="Redis client not initialized")
    return request.app.state.redis_client

def get_supabase_client(request: Request):
    """
    Dependency to get the Supabase client from app state.
    Raises an HTTPException if the client is not initialized.
    """
    if not hasattr(request.app.state, "supabase_client"):
        raise HTTPException(status_code=503, detail="Supabase client not initialized")
    return request.app.state.supabase_client 