import { MinusIcon, PlusIcon, XIcon } from "lucide-react";

export interface FileItem {
  id: number;
  file: File | null;
}

interface FileCardProps {
  title: string;
  required?: boolean;
  files: FileItem[];
  onChange: (items: FileItem[]) => void;
  border?: boolean;
  description?: string;
  placeholder?: string;
  accept?: string;
}

const FileCard = ({
  title,
  required,
  files,
  onChange,
  border = true,
  description,
  placeholder = "학습 데이터 파일을 업로드 해 주세요. (pdf, pptx, docx, txt 등)",
  accept,
}: FileCardProps) => {
  const handleAdd = () => {
    const nextId = files.length ? Math.max(...files.map((f) => f.id)) + 1 : 1;
    onChange([...files, { id: nextId, file: null }]);
  };

  const handleFileChange = (id: number, file: File | null) => {
    const exists = files.some((item) => item.id === id);
    if (!exists) {
      onChange([...files, { id, file }]);
      return;
    }

    const updated = files.map((item) =>
      item.id === id ? { ...item, file } : item
    );
    onChange(updated);
  };

  const handleClearFile = (id: number) => {
    const updated = files.map((item) =>
      item.id === id ? { ...item, file: null } : item
    );
    onChange(updated);
  };

  const handleRemoveRow = (id: number) => {
    if (files.length <= 1) {
      const cleared = files.map((item) =>
        item.id === id ? { ...item, file: null } : item
      );
      onChange(cleared);
      return;
    }

    onChange(files.filter((item) => item.id !== id));
  };

  const hasRows = files.length > 0;
  const rows = hasRows ? files : [{ id: 1, file: null }];

  return (
    <section
      className={[
        "w-full rounded-2xl px-5 py-4 bg-white",
        border ? "border border-gray-200 shadow-sm" : "",
      ].join(" ")}
    >
      {/* 제목 */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] leading-none text-gray-900">●</span>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {required && <span className="text-xs text-red-500">(필수)</span>}
      </div>

      {/* 설명 */}
      {description && (
        <p className="mb-2 ml-4 text-xs text-gray-500">{description}</p>
      )}

      {/* 파일 리스트 */}
      <div className="ml-4 flex max-w-xl flex-col gap-2 items-center">
        {rows.map((item, index) => {
          const inputId = `file-${item.id}`;
          const isFirstRow = index === 0;

          return (
            <div key={item.id} className="flex w-full h-10 items-stretch gap-2">
              {/* 파일 표시 + 선택 버튼 */}
              <label
                htmlFor={inputId}
                className="flex h-full flex-1 cursor-pointer items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white"
              >
                <div className="flex flex-1 items-center truncate px-3 text-sm text-gray-900">
                  {item.file ? (
                    item.file.name
                  ) : (
                    <span className="text-gray-400">{placeholder}</span>
                  )}
                </div>

                <div className="flex items-center bg-black px-4 text-sm font-semibold text-white">
                  파일 선택
                </div>
              </label>

              {/* 버튼 영역 */}
              {isFirstRow ? (
                item.file && (
                  <button
                    type="button"
                    onClick={() => handleClearFile(item.id)}
                    className="flex h-full aspect-square items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                )
              ) : item.file ? (
                // 추가 row + 파일 있음 → X (파일만 삭제)
                <button
                  type="button"
                  onClick={() => handleClearFile(item.id)}
                  className="flex h-full aspect-square items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              ) : (
                // 추가 row + 파일 없음 → - (row 삭제)
                <button
                  type="button"
                  onClick={() => handleRemoveRow(item.id)}
                  className="flex h-full aspect-square items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
              )}

              {/* 실제 파일 인풋 */}
              <input
                id={inputId}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  handleFileChange(item.id, file);
                  e.target.value = "";
                }}
              />
            </div>
          );
        })}

        {/* + 버튼 */}
        <button
          type="button"
          onClick={handleAdd}
          className="
            mt-1 flex h-9 w-9 items-center justify-center rounded-lg border
            border-gray-300 text-2xl leading-none text-gray-700 hover:bg-gray-50
          "
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};

export default FileCard;
