from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import lazyload

from app.module.gpt.gpt import GptSetting


class GptRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_gpt_setting(self):
        result = await self.db.execute(
            select(GptSetting)
        )
        return result.scalars().first()

    async def get_gpt_setting_by_id(self, gpt_setting_id: int):
        result = await self.db.execute(
            select(GptSetting)
            .where(GptSetting.id == gpt_setting_id)
        )
        return result.scalar_one_or_none()

    async def save_gpt_setting(self, gpt_setting_id: int, version: str, instruction: str, data_type: str, learning_text: str, fall_back_type: bool, fall_back_text: str, new_vc_id: str, new_vc_file_ids: list[str], new_vc_file_names: list[str]):
        gpt_setting = GptSetting(
            id=gpt_setting_id,
            version=version,
            instruction=instruction,
            data_type=data_type,
            learning_text=learning_text,
            fall_back_type=fall_back_type,
            fall_back_text=fall_back_text,
            vc_id=new_vc_id,
            vc_file_ids=new_vc_file_ids,
            vc_file_names=new_vc_file_names,
        )
        self.db.add(gpt_setting)
        await self.db.commit()
        return True
    