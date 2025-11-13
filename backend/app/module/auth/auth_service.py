# app/module/auth/auth_service.py

import httpx
from fastapi import HTTPException

from app.core.config.settings import settings
from app.module.auth.auth_token import AuthToken
from app.module.user.user_repository import UserRepository


class AuthService:
    def __init__(self, repo: UserRepository):
        self.repo = repo
        self.token_util = AuthToken()

    async def google_login(self, request):
        GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
        GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

        body = await request.json()
        code = body.get("code")

        token_data = {
            "code": code,
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uri": settings.google_redirect_uri,
            "grant_type": "authorization_code",
        }

        async with httpx.AsyncClient() as client:
            token_resp = await client.post(GOOGLE_TOKEN_URL, data=token_data)
            token_resp.raise_for_status()
        
            try:
                token_resp.raise_for_status()
            except httpx.HTTPStatusError as e:
                # 상태 코드와 응답 본문 출력
                print("Status Code:", e.response.status_code)
                print("Response Text:", e.response.text)
                raise HTTPException(status_code=401, detail=f"google token request failed: {e.response.text}")
            
                
            access_token = token_resp.json().get("access_token")

            if not access_token:
                raise HTTPException(status_code=500, detail="access token missing")
            
            userinfo_resp = await client.get(
                GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            userinfo_resp.raise_for_status()
            userinfo = userinfo_resp.json()

            email = userinfo.get("email")
            name = userinfo.get("name")
            picture = userinfo.get("picture", "")
        
        user = await self.repo.get_or_create_user(email, name, picture)
        
        return user 

    async def get_user_by_id(self, user_id):
        return await self.repo.get_user_by_id(user_id)
        
        
