import React from "react";

interface ToggleCardProps {
  title: string;
  required?: boolean;
  value: boolean;
  onChange: (value: boolean) => void;
  border?: boolean;
  description?: string;
  onLabel?: string;
  offLabel?: string;
}

const ToggleCard = ({
  title,
  required,
  value,
  onChange,
  border = true,
  description,
  onLabel = "사용함",
  offLabel = "사용 안 함",
}: ToggleCardProps) => {
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

      {/* 토글 영역 */}
      <div className="flex items-center gap-3 max-w-md ml-4">
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={[
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            value ? "bg-black" : "bg-gray-300",
          ].join(" ")}
        >
          <span
            className={[
              "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
              value ? "translate-x-5" : "translate-x-1",
            ].join(" ")}
          />
        </button>

        <span className="text-sm text-gray-800">
          {value ? onLabel : offLabel}
        </span>
      </div>
    </section>
  );
};

export default ToggleCard;
