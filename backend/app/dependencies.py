# app/dependencies.py
from fastapi import Request

def get_redis(request: Request):
    return request.app.state.redis

def get_supabase(request: Request):
    return request.app.state.supabase