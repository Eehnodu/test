from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.provider.endpoint import with_provider
from app.core.provider.login import login
from app.core.provider.service import ServiceProvider
from app.module.auth.auth_token import AuthToken

router = APIRouter()

@router.get("/gpt_setting")
@with_provider
@login
async def get_gpt_setting_by_id(p: ServiceProvider):
    # return await p.gpt_service.get_gpt_setting_by_id(p.request)
    return await p.gpt_service.get_gpt_setting()

@router.post("/gpt_setting/save")
@with_provider
@login
async def save_gpt_setting(p: ServiceProvider):
    return await p.gpt_service.save_gpt_setting(p.request)