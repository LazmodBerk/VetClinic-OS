from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "VCMS"
    DATABASE_URL: str = "sqlite:///./vcms.db"
    
    class Config:
        env_file = ".env"

settings = Settings()
