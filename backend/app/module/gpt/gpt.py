# app/module/user/user.py
from sqlalchemy import Boolean, Column, DateTime, Integer, String, JSON

from app.core.database.base import now_kst, register_base

Base = register_base() 

class GptSetting(Base):
    __tablename__ = "tb_gpt_settings"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    version = Column(String(20), nullable=False)
    instruction = Column(String(200), nullable=True)
    data_type = Column(String(20), nullable=False)
    learning_text = Column(String(200), nullable=True)
    fall_back_type = Column(Boolean, default=True)
    fall_back_text = Column(String(200), nullable=True)
    vc_id = Column(String(100), nullable=True)
    vc_file_ids = Column(JSON, nullable=True)
    vc_file_names = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=now_kst)



    