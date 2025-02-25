import asyncio
from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
import grpc
import json
from typing import Dict, Any, List, Optional

from app.models.requests import QueryRequest, ChatQueryRequest
from app.core.logger import setup_logger
from app.core.config import get_settings
from app.dependencies.clients import get_redis_client, get_supabase_client

from app.middleware.authMiddleware import auth_middleware
from app.grpc import chat_service_pb2, chat_service_pb2_grpc
from retrieval_service.app.core.enums import DocSource
from pydantic import BaseModel


# Create router instance
router = APIRouter(tags=["grpc"])
logger = setup_logger(__name__)

settings = get_settings()
GRPC_SERVER_ADDRESS = "localhost:50051"
CHAT_HISTORY_CACHE_TTL = 3600  # 1 hour in seconds
MAX_CHAT_HISTORY = 10  # Maximum number of messages to include in context

@router.post("/api/v1/chat/grpc/stream")
async def chat_stream(
    chat_query: ChatQueryRequest,
    redis_client = Depends(get_redis_client),
    supabase_client = Depends(get_supabase_client)
):
    """Stream chat responses with chat history context."""
    try:
        logger.info(f"Processing chat query for chat_id: {chat_query.chat_id}")
        
        # Get chat history
        chat_history = await get_chat_history(chat_query.chat_id, redis_client, supabase_client)
        
        # Create gRPC channel
        channel = grpc.aio.insecure_channel(GRPC_SERVER_ADDRESS)
        stub = chat_service_pb2_grpc.ChatServiceStub(channel)
        
        # Convert chat history to gRPC message format
        grpc_messages = []
        for msg in chat_history:
            grpc_messages.append(chat_service_pb2.Message(
                role=msg["role"],
                content=msg["content"]
            ))
        
        # Create gRPC request
        grpc_request = chat_service_pb2.ChatRequest(
            model_name=chat_query.model_name,
            query=chat_query.query,
            index_name=chat_query.index_name,
            chat_history=grpc_messages
        )
        
        # Variable to collect the full bot response
        full_bot_response = []
        
        async def response_stream():
            try:
                # Call gRPC streaming endpoint
                async for response in stub.StreamChat(grpc_request):
                    # Add content to full response if it's markdown
                    if response.type == "markdown":
                        full_bot_response.append(response.content)
                    
                    # Yield the response chunk
                    yield json.dumps({
                        "type": response.type,
                        "content": response.content
                    }) + "\n"
                    
                    # If this is the end message, update chat history cache
                    if response.type == "end":
                        # Join all markdown chunks to get the complete response
                        complete_response = "".join(full_bot_response)
                        
                        # Update chat history in background
                        asyncio.create_task(
                            update_chat_history_cache(
                                chat_query.chat_id,
                                chat_query.query,
                                complete_response,
                                redis_client
                            )
                        )
                        
            except Exception as e:
                logger.error(f"Error in streaming response: {e}")
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
        logger.error(f"Chat stream error: {e}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/api/v1/grpc/models")
async def get_available_models():
    """Get all available models from the gRPC server."""
    try:
        logger.info(f"Attempting to connect to gRPC server at {GRPC_SERVER_ADDRESS}")
        
        # Create gRPC channel
        channel = grpc.aio.insecure_channel(GRPC_SERVER_ADDRESS)
        stub = chat_service_pb2_grpc.ChatServiceStub(channel)
        
        # Create empty request
        request = chat_service_pb2.EmptyRequest()
        logger.info("Created EmptyRequest, calling GetAvailableModels")
        
        try:
            # Call gRPC endpoint with timeout
            response = await asyncio.wait_for(
                stub.GetAvailableModels(request),
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
            "models": list(response.model_names),
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
        logger.error(f"gRPC models error: {type(e).__name__}: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
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

@router.get("/api/v1/chat/history/{chat_id}")
async def get_chat_history_endpoint(
    chat_id: str,
    redis_client = Depends(get_redis_client),
    supabase_client = Depends(get_supabase_client)
):
    """Get chat history for a specific chat ID."""
    try:
        # Get chat history
        history = await get_chat_history(chat_id, redis_client, supabase_client)
        
        # Return detailed information about the chat history
        return {
            "chat_id": chat_id,
            "message_count": len(history),
            "messages": history,
            "source": "redis" if await redis_client.get(f"chat_history:{chat_id}") else "supabase"
        }
    except Exception as e:
        logger.error(f"Error retrieving chat history: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve chat history: {str(e)}"
        )

async def get_chat_history(chat_id: str, redis_client, supabase_client) -> List[Dict[str, str]]:
    """
    Get chat history for a given chat_id.
    First checks Redis cache, then falls back to Supabase if needed.
    Returns a list of message objects with 'role' and 'content' keys.
    """
    # Try to get chat history from Redis cache first
    cache_key = f"chat_history:{chat_id}"
    try:
        cached_history = await redis_client.get(cache_key)
        if cached_history:
            logger.info(f"Cache hit for chat history: {chat_id}")
            logger.info(f"Redis cache content: {json.dumps(cached_history, indent=2)}")
            return cached_history
    except Exception as e:
        logger.warning(f"Error retrieving chat history from cache: {e}")
    
    # If not in cache, fetch from Supabase
    try:
        logger.info(f"Fetching chat history from Supabase for chat_id: {chat_id}")
        
        # Query messages table for the given chat_id
        response = supabase_client.client.table('messages').select(
            "*"  # Select all columns to avoid column name issues
        ).eq('chat_id', chat_id).execute()
        
        logger.info(f"Supabase raw response: {json.dumps(response.data, indent=2)}")
        
        if not response.data:
            logger.warning(f"No messages found for chat_id: {chat_id}")
            return []
        
        # Format messages for LLM context
        messages = []
        for msg in response.data:
            # Check which column contains the message content and sender
            content_field = "content" if "content" in msg else "message"
            sender_field = "role" if "role" in msg else "sender"
            
            # Map sender/role values to LLM expected format
            if sender_field in msg:
                role = "user" if msg[sender_field] == "user" else "assistant"
            else:
                # Default if we can't determine the role
                role = "user"
                
            if content_field in msg:
                messages.append({
                    "role": role,
                    "content": msg[content_field]
                })
        
        # Take only the last MAX_CHAT_HISTORY messages
        messages = messages[-MAX_CHAT_HISTORY:] if len(messages) > MAX_CHAT_HISTORY else messages
        
        logger.info(f"Formatted messages for LLM: {json.dumps(messages, indent=2)}")
        
        # Cache the result in Redis
        try:
            await redis_client.set(cache_key, messages)
            logger.info(f"Cached chat history for chat_id: {chat_id}")
        except Exception as e:
            logger.warning(f"Failed to cache chat history: {e}")
        
        return messages
        
    except Exception as e:
        logger.error(f"Error fetching chat history from Supabase: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve chat history: {str(e)}"
        )

async def update_chat_history_cache(chat_id: str, user_query: str, bot_response: str, redis_client):
    """Update chat history in Redis cache with new messages."""
    try:
        # Get existing chat history
        cache_key = f"chat_history:{chat_id}"
        existing_history = await redis_client.get(cache_key) or []
        
        logger.info(f"Existing chat history before update: {json.dumps(existing_history, indent=2)}")
        
        # Add new messages
        existing_history.append({"role": "user", "content": user_query})
        existing_history.append({"role": "assistant", "content": bot_response})
        
        # Keep only the last MAX_CHAT_HISTORY messages
        if len(existing_history) > MAX_CHAT_HISTORY:
            existing_history = existing_history[-MAX_CHAT_HISTORY:]
        
        logger.info(f"Updated chat history to save: {json.dumps(existing_history, indent=2)}")
        
        # Update cache
        await redis_client.set(cache_key, existing_history)
        logger.info(f"Updated chat history cache for chat_id: {chat_id}")
        
    except Exception as e:
        logger.error(f"Failed to update chat history cache: {e}") 