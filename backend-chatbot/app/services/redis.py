from redis import Redis
from typing import Any, Optional, List, Dict
import json
from ..core.config import Settings
from app.core.logger import setup_logger


logger = setup_logger(__name__)

class RedisClient:
    """Redis client for caching chat history and embeddings."""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD,
            decode_responses=True
        )
        self.ttl = settings.REDIS_TTL

    async def ping(self) -> bool:
        """Test Redis connection."""
        try:
            return self.client.ping()
        except Exception as e:
            logger.error(f"Redis ping error: {str(e)}")
            return False

    async def close(self) -> None:
        """Close Redis connection."""
        try:
            self.client.close()
        except Exception as e:
            logger.error(f"Redis close error: {str(e)}")

    async def get(self, key: str) -> Optional[Any]:
        """Get value from Redis with error handling."""
        try:
            value = self.client.get(key)
            return json.loads(value) if value else None
        except Exception as e:
            logger.error(f"Redis get error: {str(e)}")
            return None

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set value in Redis with optional TTL."""
        try:
            serialized = json.dumps(value)
            return self.client.set(
                key,
                serialized,
                ex=ttl or self.ttl
            )
        except Exception as e:
            logger.error(f"Redis set error: {str(e)}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete key from Redis."""
        try:
            return bool(self.client.delete(key))
        except Exception as e:
            logger.error(f"Redis delete error: {str(e)}")
            return False

    async def get_chat_history(self, chat_id: str) -> List[Dict]:
        """Get chat history from Redis."""
        return await self.get(f"chat:{chat_id}") or []

    async def save_chat_history(self, chat_id: str, history: List[Dict]) -> bool:
        """Save chat history to Redis."""
        return await self.set(f"chat:{chat_id}", history) 