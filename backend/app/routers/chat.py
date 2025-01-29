import json
import requests
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from sse_starlette.sse import EventSourceResponse

from app.models.chat import ChatRequest

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/send")
async def send_chat(request: ChatRequest):
    try:
        ollama_response = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": request.model,
                "messages": {"role": request.messages.role, "content": request.messages.content}
            },
            stream=True
        )

        if ollama_response.status_code != 200:
            raise HTTPException(status_code=ollama_response.status_code, detail=ollama_response.text)

        async def event_stream():
            try:
                for line in ollama_response.iter_lines(decode_unicode=True):
                    if line:
                        try:
                            json_data = json.loads(line)
                            if "message" in json_data and "content" in json_data["message"]:
                                yield {
                                    "event": "message",
                                    "data": json_data["message"]["content"],
                                }
                        except json.JSONDecodeError:
                            yield {
                                "event": "error",
                                "data": "Error decoding JSON data",
                            }
            except Exception as e:
                yield {
                    "event": "error",
                    "data": str(e),
                }

        return EventSourceResponse(event_stream())

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
