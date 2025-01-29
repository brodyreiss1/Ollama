from pydantic import BaseModel
from app import settings


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: ChatMessage
    model: str = settings.AI_MODEL
