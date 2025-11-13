from datetime import datetime, timedelta
from typing import List, Optional, Tuple

from sqlalchemy import delete, desc, func, insert, or_, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.module.admin.admin import Admin

def _parse_date(d: Optional[str]):
    if not d:
        return None
    d = d.replace(".", "-")
    return datetime.strptime(d, "%Y-%m-%d")

class AdminRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_admin_by_email(self, admin_email: str) -> Admin | None:
        stmt = select(Admin).where(Admin.admin_email == admin_email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()