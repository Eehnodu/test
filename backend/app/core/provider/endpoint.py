# app/core/provider/endpoint.py

from fastapi import Depends

from app.core.provider.service import get_provider


def with_provider(func):
    """라우터에 Depends(get_provider)를 자동 주입하는 데코레이터"""
    async def wrapper(p = Depends(get_provider)):
        return await func(p)
    return wrapper
