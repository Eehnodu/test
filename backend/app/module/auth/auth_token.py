# app/module/auth/auth_token.py

import base64
import json
import uuid
from datetime import timedelta

import jwt
from fastapi import HTTPException

from app.core.config.settings import settings
from app.core.database.base import now_kst


class AuthToken:
    env = getattr(settings, "env", "dev")
    samesite = "None" if env == "prod" else "Lax"
    domain = "kokomiu.net" if env == "prod" else None

    def __init__(self):
        self.jwt_secret = settings.jwt_secret
        self.hash_key = settings.hash_key
        self.algorithm = "HS256"
        self.env = getattr(settings, "env", "dev")
        self.samesite = "None" if self.env == "prod" else "Lax"
        self.domain = "kokomiu.net" if self.env == "prod" else None
        self.secure = True if self.env == "prod" else False
    
    async def get_token_info(self, request):
        """유저 아이디 토큰에서 파싱"""
        try:
            user_info = request.cookies.get("user_info")
            access_token = request.cookies.get("access_token")
            decoded = base64.b64decode(user_info).decode("utf-8")
            data = json.loads(decoded)
            user_id = data.get("id")
            if not user_id or not access_token:
                raise HTTPException(status_code=401, detail="invalid token data")
            return user_id
        except Exception as e:
            raise HTTPException(status_code=401, detail=str(e))
    
    async def check_token_info(self, request):
        """유저 아이디 토큰이 있나 확인"""
        try:
            user_info = request.cookies.get("user_info")
            if not user_info:
                return None 

            decoded = base64.b64decode(user_info).decode("utf-8")
            data = json.loads(decoded)
            return data.get("id")

        except Exception:
            return None 

    async def create_jwt_token(self, user, response, type):
        now_kr = now_kst()

        access_payload = {
            "sub": str(user.id),
            "user": type,
            "type": "access",
            "exp": now_kr + timedelta(hours=1),
        }

        refresh_payload = {
            "sub": str(user.id),
            "user": type,
            "type": "refresh",
            "exp": now_kr + timedelta(hours=6),
        }

        access_token = jwt.encode(access_payload, self.jwt_secret, algorithm=self.algorithm)
        refresh_token = jwt.encode(refresh_payload, self.jwt_secret, algorithm=self.algorithm)

        if type == "user":
            session_info = {
                "auth_type": type,
                "id": user.id,
                "user_nickname": user.user_nickname,
                "created_at": user.created_at.isoformat() if user.created_at else None, 
            }
        else:
            session_info = {
                "auth_type": type,
                "id": user.id,
                "created_at": user.created_at.isoformat() if user.created_at else None,
            }

        # 공통 쿠키 설정
        encoded_info = base64.b64encode(
            json.dumps(session_info, ensure_ascii=False).encode("utf-8")
        ).decode("utf-8")

        # 프론트에서 읽어야 하므로 httponly=False
        cookie_common = {
            "secure": self.secure,
            "samesite": self.samesite,
            "path": "/",
        }
        # prod일 때만 domain 붙이기
        if self.domain:
            cookie_common["domain"] = self.domain

        response.set_cookie(
            key="user_info",
            value=encoded_info,
            httponly=False,
            max_age=3600,
            **cookie_common,
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            max_age=3600,
            **cookie_common,
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            max_age=21600,
            **cookie_common,
        )

        response.set_cookie(
            key="refresh_exp",
            value=jwt.encode({"uuid": str(uuid.uuid4())}, settings.jwt_secret, algorithm="HS256"),
            **cookie_common,
            max_age=21600,
        )

    async def verify_refresh(self, request):
        """refresh_token 검증 및 user_id 반환"""
        try:
            refresh_token = request.cookies.get("refresh_token")
            if not refresh_token:
                raise HTTPException(status_code=401, detail="refresh token not found")

            # JWT 디코드
            payload = jwt.decode(refresh_token, self.jwt_secret, algorithms=[self.algorithm])

            print("payload", payload)
            if payload.get("type") != "refresh":
                raise HTTPException(status_code=401, detail="invalid token type")

            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(status_code=401, detail="invalid refresh payload")

            type = payload.get("user")

            return user_id, type

        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="refresh token expired")
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=401, detail=f"invalid refresh token: {str(e)}")

    async def delete_token(self, response):
        """토큰 삭제 및 로그아웃 처리"""
        cookie_common = {
            "secure": self.secure,
            "samesite": self.samesite,
            "path": "/",
        }
        # prod일 때만 domain 붙이기
        if self.domain:
            cookie_common["domain"] = self.domain

        response.delete_cookie("access_token", **cookie_common)
        response.delete_cookie("refresh_token", **cookie_common)
        response.delete_cookie("user_info", **cookie_common)
        response.delete_cookie("refresh_exp", **cookie_common)