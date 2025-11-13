# app/core/provider/login.py

from functools import wraps

from fastapi import HTTPException

from app.module.auth.auth_token import AuthToken

def login(func):
    """로그인 필수 라우트용 데코레이터"""
    @wraps(func)
    async def wrapper(p, *args, **kwargs):
        token_util = AuthToken()
        try:
            user_id = await token_util.get_token_info(p.request)
            p.request.user_id = user_id 
        except HTTPException:
            raise HTTPException(status_code=401, detail="Unauthorized")
        return await func(p, *args, **kwargs)
    return wrapper
