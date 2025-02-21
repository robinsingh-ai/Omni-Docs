from supabase import create_client, Client
from typing import Dict, List, Optional
from ..core.config import Settings
from app.core.logger import setup_logger

logger = setup_logger(__name__)

class SupabaseClient:
    """Supabase client for data persistence."""
    
    def __init__(self, settings: Settings):
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY
        )

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

    async def get_chat_history(self, chat_id: str) -> List[Dict]:
        """Get chat history."""
        try:
            response = self.client.table('messages')\
                .select('*')\
                .eq('chat_id', chat_id)\
                .order('created_at')\
                .execute()
            return response.data
        except Exception as e:
            logger.error(f"Supabase get_chat_history error: {str(e)}")
            raise 