from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import grpc
import json
from typing import Dict, Any

from app.models.requests import QueryRequest
from app.core.logger import setup_logger

from app.middleware.authMiddleware import auth_middleware
from app.grpc import chat_service_pb2, chat_service_pb2_grpc
from retrieval_service.app.core.enums import DocSource

# Create router instance
router = APIRouter(tags=["grpc"])
logger = setup_logger(__name__)

GRPC_SERVER_ADDRESS = "localhost:50051"

@router.post("/api/v1/stream/test")
async def test_grpc_stream(request: QueryRequest, auth=Depends(auth_middleware)):
    try:
        # Create gRPC channel
        channel = grpc.aio.insecure_channel(GRPC_SERVER_ADDRESS)
        stub = chat_service_pb2_grpc.ChatServiceStub(channel)
        
        # Send the raw string without converting to enum value
        grpc_request = chat_service_pb2.ChatRequest(
            model_name=request.model_name,
            query=request.query,
            index_name=request.index_name,  # Send the raw string
            chat_history=[]
        )
        
        async def response_stream():
            try:
                # Call gRPC streaming endpoint
                async for response in stub.StreamChat(grpc_request):
                    yield json.dumps({
                        "type": response.type,
                        "content": response.content
                    }) + "\n"
            except Exception as e:
                yield json.dumps({
                    "type": "error",
                    "content": str(e)
                }) + "\n"
            finally:
                await channel.close()
        
        return StreamingResponse(
            response_stream(),
            media_type='application/json'
        )
        
    except Exception as e:
        logger.error(f"gRPC stream error: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 