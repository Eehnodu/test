# app/module/user/user.py
from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.core.database.base import now_kst, register_base

Base = register_base() 

class User(Base):
    __tablename__ = "tb_users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_nickname = Column(String(20), nullable=False)
    user_email = Column(String(100), unique=True, nullable=False)
    user_profile_image = Column(String(200), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=now_kst)
    last_login_at = Column(DateTime(timezone=True))

    