from sqlalchemy import Column, Integer, String, ForeignKey
from .base import Base, TimeStampedModel

class Chat(Base, TimeStampedModel):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    agent = Column(String)