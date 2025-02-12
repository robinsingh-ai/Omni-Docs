from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageBase(BaseModel):
    message: str
    message_type: str

class MessageCreate(MessageBase):
    chat_id: int

class MessageUpdate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    chat_id: int
    timestamp: datetime
    created_at: datetime
    updated_at: datetime
    is_deleted: bool

    class Config:
        from_attributes = True