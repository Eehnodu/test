# app/module/auth/auth_router.py

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.core.provider.endpoint import with_provider
from app.core.provider.login import login
from app.core.provider.service import ServiceProvider

router = APIRouter()

@router.post("/login")
@with_provider
async def admin_login(p: ServiceProvider):
    print(p.request)
    admin = await p.admin_service.admin_login(p.request)
    response = JSONResponse(status_code=200, content={"message": "admin login successful"})
    admin.user_nickname = "admin"
    await p.auth_service.token_util.create_jwt_token(admin, response, "admin")
    return response

@router.post("/logout")
@with_provider
async def admin_logout(p: ServiceProvider):
    response = JSONResponse(status_code=200, content={"message": "admin logout successful"})
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    response.delete_cookie("user_info")
    response.delete_cookie("refresh_exp")
    return response