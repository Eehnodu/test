# app/module/auth/auth_service.py

from fastapi import HTTPException
from passlib.context import CryptContext

from app.module.admin.admin_repository import AdminRepository

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

class AdminService:
    def __init__(self, admin_repo: AdminRepository):
        self.admin_repo = admin_repo

    async def get_admin_by_id(self, admin_id: int):
        return await self.admin_repo.get_admin_by_id(admin_id)

    async def admin_login(self, request):
        body = await request.json()
        admin_email = body.get("admin_email")
        admin_password = body.get("admin_password")

        if not admin_email or not admin_password:
            raise HTTPException(status_code=422, detail="admin_email and admin_password are required")

        admin = await self.admin_repo.get_admin_by_email(admin_email)
        if not admin:
            raise HTTPException(status_code=401, detail="invalid credentials")

        print("hashed_password", hash_password(admin_password))

        if not verify_password(admin_password, admin.admin_password):
            raise HTTPException(status_code=401, detail="invalid credentials")
        return admin
        