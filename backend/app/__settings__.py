from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CORS_ALLOW_ORIGINS: str = "*"
    AI_MODEL: str = "deepseek-r1:32b"

settings = Settings()
