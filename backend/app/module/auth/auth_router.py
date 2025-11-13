# app/module/auth/auth_router.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from app.core.provider.endpoint import with_provider
from app.core.provider.login import login
from app.core.provider.service import ServiceProvider

router = APIRouter()

@router.post("/google")
@with_provider
async def google_login(p: ServiceProvider):
    user = await p.auth_service.google_login(p.request)
    response = JSONResponse(status_code=200, content={"message": "user login successful"})

    await p.auth_service.token_util.create_jwt_token(user, response, "user")
    return response

@router.post("/refresh_token")
@with_provider
async def refresh_token(p: ServiceProvider):
    user_id = await p.auth_service.token_util.verify_refresh(p.request)
    user = await p.auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    response = JSONResponse(status_code=200, content={"message": "user login successful"})
    await p.auth_service.token_util.create_jwt_token(user, response, "user")
    return response

@router.post("/logout")
@with_provider
@login
async def logout(p:ServiceProvider):
    response = JSONResponse(status_code=200, content={"message": "user logout successful"})
    await p.auth_service.token_util.delete_token(response)

    return response
