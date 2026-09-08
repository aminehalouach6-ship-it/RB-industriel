import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RB INDUSTRIEL - API Gaz Industriels & Soudage"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database URL (supports Vercel Postgres, Neon, Render, Supabase and local)
    DATABASE_URL: str = (
        os.getenv("POSTGRES_URL") 
        or os.getenv("POSTGRES_PRISMA_URL") 
        or os.getenv("DATABASE_URL", "postgresql://tenira_user:tenira_password@localhost:5432/tenira_db")
    )
    
    # CORS Origins
    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS", 
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,*"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS or self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def normalized_database_url(self) -> str:
        # Render sometimes provides postgres:// which SQLAlchemy 1.4+ deprecated in favor of postgresql://
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    class Config:
        case_sensitive = True

settings = Settings()
