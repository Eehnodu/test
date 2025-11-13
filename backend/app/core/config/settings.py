# app/core/config/settings.py
import os
import socket
from pathlib import Path
from typing import List, Optional

from pydantic_settings import BaseSettings


class RawEnv(BaseSettings):
    # MySQL 설정
    local_mysql_user: str
    local_mysql_password: str
    local_mysql_host: str
    local_mysql_db: str

    prod_mysql_user: str
    prod_mysql_password: str
    prod_mysql_host: str
    prod_mysql_db: str

    mysql_port: int = 3306

    # API keys
    openai_api_key: Optional[str] = None

    jwt_secret: str
    hash_key: str

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env")
        env_file_encoding = "utf-8"


class Settings:
    def __init__(self):
        self.raw = RawEnv()
        self.env = self._detect_env()
        self.BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
        self.APP_DIR = self.BASE_DIR / "app"
        self.MEDIA_ROOT = self.BASE_DIR / "media"                       

    def _detect_env(self) -> str:
        """호스트명으로 로컬/운영 환경 구분"""
        hostname = socket.gethostname()
        if hostname.startswith("ip-") or hostname.startswith("ec2-"):
            return "prod"
        return "local"

    # ✅ MySQL 설정
    @property
    def mysql_user(self) -> str:
        return getattr(self.raw, f"{self.env}_mysql_user")

    @property
    def mysql_password(self) -> str:
        return getattr(self.raw, f"{self.env}_mysql_password")

    @property
    def mysql_host(self) -> str:
        return getattr(self.raw, f"{self.env}_mysql_host")

    @property
    def mysql_db(self) -> str:
        return getattr(self.raw, f"{self.env}_mysql_db")

    @property
    def mysql_port(self) -> int:
        return self.raw.mysql_port

    # ✅ SQLAlchemy용 비동기 DB URL
    @property
    def database_url(self) -> str:
        return (
            f"mysql+aiomysql://{self.mysql_user}:{self.mysql_password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_db}"
        )

    # API Keys
    @property
    def openai_api_key(self) -> Optional[str]:
        return self.raw.openai_api_key
    
    @property
    def jwt_secret(self) -> str:
        return self.raw.jwt_secret

    @property
    def hash_key(self) -> str:
        return self.raw.hash_key

# 전역 인스턴스
settings = Settings()
DATABASE_URL = settings.database_url
