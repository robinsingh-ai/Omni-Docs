from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
import grpc
import json
from typing import Dict, Any
import asyncio

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

@router.get("/api/v1/grpc/models")
async def get_available_models():
    """Get all available models from the gRPC server."""
    try:
        # Create gRPC channel
        channel = grpc.aio.insecure_channel(GRPC_SERVER_ADDRESS)
        stub = chat_service_pb2_grpc.ChatServiceStub(channel)
        
        # Create empty request
        request = chat_service_pb2.EmptyRequest()
        
        # Call gRPC endpoint
        response = await stub.GetAvailableModels(request)
        
        await channel.close()
        
        # Convert gRPC response to dict
        return {
            "success": response.success,
            "models": list(response.model_names),  # Convert to regular Python list
            "message": response.message
        }
            
    except Exception as e:
        logger.error(f"gRPC models error: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/api/v1/grpc/sources")
async def get_available_sources():
    """Get all available documentation sources from the gRPC server."""
    try:
        logger.info(f"Attempting to connect to gRPC server at {GRPC_SERVER_ADDRESS}")
        
        # Create gRPC channel
        channel = grpc.aio.insecure_channel(GRPC_SERVER_ADDRESS)
        stub = chat_service_pb2_grpc.ChatServiceStub(channel)
        
        # Create empty request
        request = chat_service_pb2.EmptyRequest()
        logger.info("Created EmptyRequest, calling GetAvailableSources")
        
        try:
            # Call gRPC endpoint with timeout
            response = await asyncio.wait_for(
                stub.GetAvailableSources(request),
                timeout=5.0  # 5 second timeout
            )
            logger.info(f"Received response: {response}")
        except asyncio.TimeoutError:
            logger.error("gRPC call timed out")
            raise HTTPException(
                status_code=504,
                detail="Request to gRPC server timed out"
            )
        
        await channel.close()
        logger.info("Channel closed")
        
        # Convert gRPC response to dict
        result = {
            "success": response.success,
            "sources": list(response.source_names),
            "message": response.message
        }
        logger.info(f"Returning result: {result}")
        return result
            
    except grpc.RpcError as e:
        status_code = e.code()
        logger.error(f"gRPC error: {status_code} - {e.details()}")
        raise HTTPException(
            status_code=500,
            detail=f"gRPC error: {status_code} - {e.details()}"
        )
    except Exception as e:
        logger.error(f"gRPC sources error: {type(e).__name__}: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        ) 