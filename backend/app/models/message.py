from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from .base import Base, TimeStampedModel

class Message(Base, TimeStampedModel):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    message = Column(String)
    message_type = Column(String)
    timestamp = Column(DateTime)