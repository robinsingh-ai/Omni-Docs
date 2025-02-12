from sqlalchemy import Column, Integer, String
from .base import Base, TimeStampedModel

class User(Base, TimeStampedModel):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)