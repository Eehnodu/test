import React from "react";

interface TextareaCardProps {
  title: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  border?: boolean;
  description?: string;
  placeholder?: string;
  rows?: number;
}

const TextareaCard = ({
  title,
  required,
  value,
  onChange,
  border = true,
  description,
  placeholder = "내용을 입력하세요",
  rows = 5,
}: TextareaCardProps) => {
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
        {required && (
          <span className="text-xs text-red-500 font-medium">(필수)</span>
        )}
      </div>

      {/* 설명 */}
      {description && (
        <p className="mb-2 text-xs text-gray-500 ml-4">{description}</p>
      )}

      {/* textarea */}
      <div className="max-w-xl ml-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="
            w-full resize-none rounded-lg border border-gray-300 
            px-3 py-2 text-sm text-gray-900
            focus:border-black focus:outline-none
          "
        />
      </div>
    </section>
  );
};

export default TextareaCard;
