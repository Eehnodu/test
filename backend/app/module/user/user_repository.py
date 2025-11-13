# app/module/user/user_repository.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import lazyload

from app.module.user.user import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_id(self, user_id: int):
        result = await self.db.execute(
            select(User)
            .options(lazyload("*"))
            .where(User.id == user_id)
        )
        return result.scalar_one()
    