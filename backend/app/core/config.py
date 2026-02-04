from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mentiscope API"
    API_V1_STR: str = "/api/v1"
    
    # CORS - Allow both production and development
    FRONTEND_URL: str = "https://mentiscope.vercel.app"  # Override with env var for development
    BACKEND_CORS_ORIGINS: List[str] = []
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set CORS origins based on FRONTEND_URL
        self.BACKEND_CORS_ORIGINS = [self.FRONTEND_URL]
    
    # DATABASE
    DATABASE_URL: str = "sqlite+aiosqlite:///./test.db" 

    # SECURITY (Supabase)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # SUPPORT CLIENT
    SUPABASE_SUPPORT_URL: str = "https://ldewwmfkymjmokopulys.supabase.co/functions/v1/submit-support"
    FORM_SECRET: str = "" # Set in .env

    # AI
    OPENAI_API_KEY: str = ""
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
