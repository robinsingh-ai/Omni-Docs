# app/routes/status.py
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime
import psutil
import time
import os

from app.models.requests import StatusResponse
from app.core.logger import setup_logger
from app.core.dependencies import get_llm, get_faiss_manager

router = APIRouter()
logger = setup_logger(__name__)

SERVER_START_TIME = time.time()

@router.get("/status", response_model=StatusResponse)
async def server_status():
    """Get server status and health metrics"""
    try:
        # Calculate uptime
        uptime = time.time() - SERVER_START_TIME
        
        # Get system stats
        cpu_usage = psutil.cpu_percent()
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Check components status
        components_status = {
            "server": "operational",
        }
        
        # Check FAISS more safely
        try:
            data_dir = "data"
            if os.path.exists(data_dir) and len(os.listdir(data_dir)) > 0:
                components_status["faiss"] = "operational"
            else:
                components_status["faiss"] = "no indices"
        except Exception:
            components_status["faiss"] = "error"
        
        # Check LLM
        try:
            llm = get_llm()
            llm.predict("test")
            components_status["llm"] = "operational"
        except Exception:
            components_status["llm"] = "error"

        return {
            "status": "operational",
            "timestamp": datetime.now().isoformat(),
            "uptime": round(uptime, 2),
            "server_stats": {
                "cpu_usage_percent": cpu_usage,
                "memory_usage_percent": memory.percent,
                "disk_usage_percent": disk.percent,
                "memory_available_gb": round(memory.available / (1024**3), 2),
                "disk_free_gb": round(disk.free / (1024**3), 2)
            },
            "components": components_status
        }
    except Exception as e:
        logger.error(f"Error checking server status: {e}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "error",
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            }
        )