import { useState, useEffect } from "react";
import SelectCard from "@/component/admin/common/cards/selectCard";
import RadioCard from "@/component/admin/common/cards/radioCard";
import ToggleCard from "@/component/admin/common/cards/toggleCard";
import TextareaCard from "@/component/admin/common/cards/textareaCard";
import FileCard from "@/component/admin/common/cards/fileCard";
import { FileItem } from "@/component/admin/common/cards/fileCard";
import { usePost, useGet } from "@/hooks/common/useAPI";
import Button from "@/component/common/button";
import { useQueryClient } from "@tanstack/react-query";

export interface GptSetting {
  id: number;
  version: string;
  instruction: string;
  data_type: string;
  learning_text: string;
  fall_back_type: boolean;
  fall_back_text: string;
}

const VERSION_OPTIONS = [
  { label: "gpt-4o-mini", value: "gpt-4o-mini" },
  { label: "gpt-4o", value: "gpt-4o" },
  { label: "gpt-5", value: "gpt-5" },
  { label: "gpt-5 mini", value: "gpt-5 mini" },
  { label: "gpt-5 nano", value: "gpt-5 nano" },
];

const DATA_TYPE_OPTIONS = [
  { label: "텍스트 입력", value: "text" },
  { label: "파일 입력", value: "file" },
];

const AdminGpt = () => {
  const queryClient = useQueryClient();
  const [gptSettingId, setGptSettingId] = useState<number | null>(null);
  const [version, setVersion] = useState("");
  const [dataType, setDataType] = useState("text");
  const [fallBackType, setFallBackType] = useState(true);
  const [learningText, setLearningText] = useState("");
  const [instruction, setInstruction] = useState("");
  const [fallBackText, setFallBackText] = useState("");
  const [files, setFiles] = useState<FileItem[]>([{ id: 1, file: null }]);

  const { data: getSettingData } = useGet<GptSetting>("api/gpt/gpt_setting", [
    "gpt_setting",
  ]);

  console.log(getSettingData);

  const saveMutation = usePost<FormData, void>("api/gpt/gpt_setting/save");

  const handleSave = () => {
    const formData = new FormData();

    if (gptSettingId !== null) {
      formData.append("gpt_setting_id", gptSettingId as unknown as any);
    }

    formData.append("version", version);
    formData.append("instruction", instruction);
    formData.append("data_type", dataType);
    formData.append("learning_text", learningText);
    formData.append("fall_back_type", String(fallBackType));
    formData.append("fall_back_text", fallBackText);

    if (dataType === "file") {
      files.forEach((item) => {
        if (item.file) {
          formData.append("files", item.file);
        }
      });
    }

    saveMutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["gpt_setting"] });
      },
    });
  };

  useEffect(() => {
    if (!getSettingData) return;

    setGptSettingId(getSettingData.id);
    setVersion(getSettingData.version ?? "");
    setInstruction(getSettingData.instruction ?? "");
    setDataType(getSettingData.data_type ?? "text");
    setLearningText(getSettingData.learning_text ?? "");
    setFallBackType(
      typeof getSettingData.fall_back_type === "boolean"
        ? getSettingData.fall_back_type
        : true
    );
    setFallBackText(getSettingData.fall_back_text ?? "");
  }, [getSettingData]);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto px-20 py-10">
      <SelectCard
        title="GPT 버전"
        required
        options={VERSION_OPTIONS}
        value={version}
        onChange={setVersion}
        placeholder="GPT 버전을 선택하세요"
        description="사용할 GPT 모델 버전을 선택하세요."
        border={false}
      />

      <TextareaCard
        title="GPT 지침 데이터 입력"
        required
        value={instruction}
        onChange={setInstruction}
        description="GPT에게 지시할 지침을 입력하세요."
        rows={8}
        border={false}
      />

      <RadioCard
        title="GPT 학습 데이터 입력 방식"
        required
        options={DATA_TYPE_OPTIONS}
        value={dataType}
        onChange={setDataType}
        description="GPT 학습 데이터 입력 방식을 선택하세요."
        direction="row"
        border={false}
      />

      {dataType === "text" && (
        <TextareaCard
          title="GPT 학습 데이터 텍스트 입력"
          required
          value={learningText}
          onChange={setLearningText}
          description="모델이 참고할 텍스트 데이터를 입력하세요."
          rows={8}
          border={false}
        />
      )}

      {dataType === "file" && (
        <FileCard
          title="GPT 학습 데이터 파일"
          required
          files={files}
          onChange={setFiles}
          description="학습 데이터 파일을 업로드 해 주세요. (pdf, pptx, docx, txt 등)"
          accept=".pdf,.pptx,.docx,.txt"
          border={false}
        />
      )}
      <ToggleCard
        title="GPT 기본 데이터 사용"
        required
        value={fallBackType}
        onChange={setFallBackType}
        description="GPT가 가지고 있는 기본 데이터도 함께 사용할지 선택하세요."
        border={false}
        onLabel="GPT 기본 데이터 사용"
        offLabel="GPT 기본 데이터 미사용"
      />

      {!fallBackType && (
        <TextareaCard
          title="GPT 미사용시 출력할 텍스트"
          required
          value={fallBackText}
          onChange={setFallBackText}
          description="GPT 미사용시 출력할 텍스트를 입력하세요."
          rows={8}
          border={false}
        />
      )}

      <div className="flex justify-center">
        <Button variant="solid" intent="primary" size="md" onClick={handleSave}>
          저장하기
        </Button>
      </div>
    </div>
  );
};

export default AdminGpt;
