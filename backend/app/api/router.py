from fastapi import APIRouter
from .endpoints import health, websocket

router = APIRouter()

router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(websocket.router, tags=["websocket"])