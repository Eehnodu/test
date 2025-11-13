from fastapi.responses import JSONResponse
from app.module.gpt.gpt_repository import GptRepository
from openai import AsyncOpenAI
from app.core.config.settings import settings
from typing import List, Optional, Tuple
from fastapi.encoders import jsonable_encoder

client = AsyncOpenAI(api_key=settings.openai_api_key)

class GptService:
    def __init__(self, repo: GptRepository):
        self.repo = repo

    async def get_gpt_setting(self):
        result = await self.repo.get_gpt_setting()
        if result:
            data = jsonable_encoder(result)
            return JSONResponse(status_code=200, content=data)
        else:
            return JSONResponse(status_code=200, content=None)

    async def get_gpt_setting_by_id(self,request):
        qp = request.query_params
        gpt_setting_id = int(qp.get("gpt_setting_id"))
        result = await self.repo.get_gpt_setting_by_id(gpt_setting_id)
        if result:
            data = jsonable_encoder(result)
            return JSONResponse(status_code=200, content=data)
        else:
            return JSONResponse(status_code=200, content=None)

    async def save_gpt_setting(self,request):
        try:
            form = await request.form()
            gpt_setting_id = int(form.get("gpt_setting_id")) if form.get("gpt_setting_id") else None
            version = form.get("version")
            instruction = form.get("instruction")
            data_type = form.get("data_type")
            learning_text = form.get("learning_text")
            fall_back_type = True if form.get("fall_back_type") == "true" else False
            fall_back_text = form.get("fall_back_text")
            files = form.getlist("files")

            print("gpt_setting_id", gpt_setting_id)
            print("version", version)
            print("instruction", instruction)
            print("data_type", data_type)
            print("learning_text", learning_text)
            print("fall_back_type", fall_back_type)
            print("fall_back_text", fall_back_text)
            print("files", files)

            new_vc_id = None
            new_vc_file_ids: list[str] = []
            new_vc_file_names: list[str] = []

            if data_type == "file":
                learning_text = None
                if gpt_setting_id:
                    # 기존 설정이면 기존 VC 정보 가져와서 쓰고,
                    # 필요하면 여기에 파일 추가 로직 나중에 넣으면 됨
                    # gpt_setting = await self.repo.get_gpt_setting_by_id(gpt_setting_id)
                    # new_vc_id = gpt_setting.vc_id
                    # new_vc_file_ids = gpt_setting.vc_file_ids or []
                    # new_vc_file_names = gpt_setting.vc_file_names or []

                    # # 새 파일도 있다면 VC에 추가
                    # if files:
                    #     add_ids, add_names = await self.add_files(new_vc_id, files)
                    #     new_vc_file_ids.extend(add_ids)
                    #     new_vc_file_names.extend(add_names)
                    print(gpt_setting_id)
                else:
                    new_vc_id = await self.create_vc()
                    new_vc_file_ids, new_vc_file_names = await self.add_files(new_vc_id, files)

            elif data_type == "text":
                if gpt_setting_id:
                    gpt_setting = await self.repo.get_gpt_setting_by_id(gpt_setting_id)
                    existing_vc_id = gpt_setting.vc_id
                    existing_vc_file_ids = gpt_setting.vc_file_ids or []
                    await self.delete_files(existing_vc_id, existing_vc_file_ids)

                new_vc_id = None
                new_vc_file_ids = []
                new_vc_file_names = []

            print("new_vc_id", new_vc_id)
            print("new_vc_file_ids", new_vc_file_ids)
            print("new_vc_file_names", new_vc_file_names)

            result = await self.repo.save_gpt_setting(
                gpt_setting_id,
                version,
                instruction,
                data_type,
                learning_text,
                fall_back_type,
                fall_back_text,
                new_vc_id,
                new_vc_file_ids,
                new_vc_file_names,
            )
            if result:
                return JSONResponse(status_code=200, content="gpt setting saved successfully")
            else:
                return JSONResponse(status_code=500, content="gpt setting save failed")
        except Exception as e:
            print(f"[save_gpt_setting error] {e}")
            return JSONResponse(status_code=500, content="gpt setting save failed")

    # vc 생성
    async def create_vc(self) -> str:
        vs = await client.vector_stores.create(name="gpt_vc")
        return vs.id

    # vc 삭제
    async def delete_vc(self, vc_id: str):
        await client.vector_stores.delete(vector_store_id=vc_id)
        return True

    # vc 파일 추가
    async def add_files(self, vc_id, files):
        vc_file_ids = []
        vc_file_names = []
        for file in files:
            if hasattr(file, "read"):
                file_name = file.filename
                file_content = await file.read()
            else:
                continue
            created = await client.files.create(
                file=(file_name, file_content),
                purpose="assistants",
            )
            vc_file_ids.append(created.id)
            vc_file_names.append(file_name)

        if vc_file_ids:
            await client.vector_stores.file_batches.create_and_poll(
                vector_store_id=vc_id,
                file_ids=vc_file_ids,
            )
        return vc_file_ids, vc_file_names

    # 파일 삭제
    async def delete_files(self, vc_id: str, file_ids: list[str]):
        for fid in file_ids:
            try:
                await client.vector_stores.files.delete(
                    vector_store_id=vc_id,
                    file_id=fid,
                )
            except Exception as e:
                print(f"[unlink warn] vc={vc_id}, file={fid}, err={e}")

        for fid in file_ids:
            try:
                await client.files.delete(fid)
            except Exception as e:
                print(f"[files.delete warn] file={fid}, err={e}")

        return True

    # 중복 제거
    def dedupe_pair(ids: List[str], names: List[Optional[str]]) -> Tuple[List[str], List[Optional[str]]]:
        seen = set()
        out_ids, out_names = [], []
        for i, fid in enumerate(ids):
            if fid and fid not in seen:
                seen.add(fid)
                out_ids.append(fid)
                out_names.append(names[i] if i < len(names) else None)
        return out_ids, out_names