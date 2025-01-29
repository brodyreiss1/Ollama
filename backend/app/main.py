from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import settings
from .routers import router

app = FastAPI(title="Ollama API")

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def main():
    return {"message": "Ollama API - Deepseek-r1:32b"}
