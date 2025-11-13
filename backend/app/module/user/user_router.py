from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.provider.endpoint import with_provider
from app.core.provider.login import login
from app.core.provider.service import ServiceProvider
from app.module.auth.auth_token import AuthToken

router = APIRouter()

@router.get("/me")
@with_provider
@login
async def get_me(p: ServiceProvider):
    return await p.user_service.get_me(p.request)
