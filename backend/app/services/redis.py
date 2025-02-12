import redis
from typing import Any, Optional
from ..utils.logger import setup_logger

logger = setup_logger(__name__)

class RedisClient:
    def __init__(self, host: str, port: int, db: int):
        try:
            self.client = redis.Redis(
                host=host,
                port=port,
                db=db,
                decode_responses=True,
                socket_connect_timeout=5
            )
            self.client.ping()
            logger.info(f"Successfully connected to Redis at {host}:{port}")
        except redis.ConnectionError as e:
            logger.error(f"Redis connection failed: {str(e)}")
            raise

    async def get(self, key: str) -> Optional[str]:
        try:
            value = self.client.get(key)
            logger.debug(f"Retrieved value for key: {key}")
            return value
        except Exception as e:
            logger.error(f"Error getting key {key}: {str(e)}")
            raise