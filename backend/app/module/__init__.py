# app/module/__init__.py
from fastapi import FastAPI

from app.module.admin import admin_router
# --- 라우터 등록 함수 ---
from app.module.auth import auth_router
# --- 모델 등록 (SQLAlchemy 관계 인식용) ---
from app.module.user import user_router
from app.module.gpt import gpt_router
from app.module.admin import admin_router

def register_routers(app: FastAPI):
    """모든 도메인 라우터를 FastAPI 인스턴스에 등록"""
    app.include_router(auth_router.router, prefix="/api/auth")
    app.include_router(user_router.router, prefix="/api/user")
    app.include_router(admin_router.router, prefix="/api/admin")
    app.include_router(gpt_router.router, prefix="/api/gpt")