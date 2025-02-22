from supabase import create_client, Client
from typing import Dict, List, Optional, Any
from ..core.config import Settings
from app.core.logger import setup_logger

logger = setup_logger(__name__)

class SupabaseClient:
    """Supabase client for data persistence."""
    
    def __init__(self, settings: Settings):
        try:
            self.client: Client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_KEY
            )
            logger.info(f"Successfully connected to Supabase at {settings.SUPABASE_URL}")
        except Exception as e:
            logger.error(f"Failed to connect to Supabase: {str(e)}")
            raise

    async def health_check(self) -> bool:
        """Test Supabase connection."""
        try:
            # Simple query to test connection
            response = self.client.table('health').select("*").limit(1).execute()
            return True
        except Exception as e:
            logger.error(f"Supabase health check error: {str(e)}")
            return False

    async def close(self) -> None:
        """Close Supabase connection."""
        # Supabase-py doesn't require explicit closure
        pass

    async def get_user(self, user_id: int) -> Optional[dict]:
        try:
            response = await self.client.table('users').select("*").eq('id', user_id).execute()
            logger.debug(f"Retrieved user with ID: {user_id}")
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error getting user {user_id}: {str(e)}")
            raise

    async def get_chat_history(self, chat_id: str) -> List[Dict[str, Any]]:
        try:
            response = await self.client.table('chats').select("*").eq('id', chat_id).execute()
            logger.debug(f"Retrieved chat history for chat ID: {chat_id}")
            return response.data if response.data else []
        except Exception as e:
            logger.error(f"Error getting chat history {chat_id}: {str(e)}")
            raise

    async def save_chat_message(self, chat_id: str, role: str, content: str) -> bool:
        try:
            response = await self.client.table('messages').insert({
                'chat_id': chat_id,
                'role': role,
                'content': content
            }).execute()
            logger.debug(f"Saved message for chat ID: {chat_id}")
            return True
        except Exception as e:
            logger.error(f"Error saving chat message: {str(e)}")
            return False

    async def create_chat(self, user_id: str, title: str) -> Dict:
        """Create new chat session."""
        try:
            response = self.client.table('chats').insert({
                'user_id': user_id,
                'title': title,
                'status': 'active'
            }).execute()
            return response.data[0]
        except Exception as e:
            logger.error(f"Supabase create_chat error: {str(e)}")
            raise

    async def save_message(
        self,
        chat_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict] = None
    ) -> Dict:
        """Save chat message."""
        try:
            response = self.client.table('messages').insert({
                'chat_id': chat_id,
                'role': role,
                'content': content,
                'metadata': metadata or {}
            }).execute()
            return response.data[0]
        except Exception as e:
            logger.error(f"Supabase save_message error: {str(e)}")
            raise 