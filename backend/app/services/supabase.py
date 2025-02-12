from supabase import create_client
from typing import Optional, List, Dict, Any
from ..utils.logger import setup_logger

logger = setup_logger(__name__)

class SupabaseClient:
    def __init__(self, url: str, key: str):
        try:
            self.client = create_client(url, key)
            logger.info(f"Successfully connected to Supabase at {url}")
        except Exception as e:
            logger.error(f"Failed to connect to Supabase: {str(e)}")
            raise

    async def get_user(self, user_id: int) -> Optional[dict]:
        try:
            response = await self.client.table('users').select("*").eq('id', user_id).execute()
            logger.debug(f"Retrieved user with ID: {user_id}")
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error getting user {user_id}: {str(e)}")
            raise