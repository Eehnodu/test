import React from "react";

interface Option {
  label: string;
  value: string;
}

interface RadioCardProps {
  title: string;
  required?: boolean;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  border?: boolean;
  description?: string;
  direction?: "col" | "row";
}

const RadioCard = ({
  title,
  required,
  options,
  value,
  onChange,
  border = true,
  description,
  direction = "col",
}: RadioCardProps) => {
  const layoutClass =
    direction === "col"
      ? "flex flex-col gap-1.5"
      : "flex flex-row flex-wrap gap-x-4 gap-y-1.5";

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

      {/* 옵션 리스트 (SelectCard처럼 max-w-md 안에 정렬) */}
      <div className="max-w-md ml-4">
        <div className={layoutClass}>
          {options.map((opt) => {
            const active = opt.value === value;

            return (
              <label
                key={opt.value}
                className={[
                  "flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 transition-colors",
                  active ? "bg-gray-100" : "hover:bg-gray-50",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name={title}
                  checked={active}
                  value={opt.value}
                  onChange={() => onChange(opt.value)}
                  className="h-4 w-4 cursor-pointer accent-black"
                />
                <span
                  className={[
                    "text-sm",
                    active ? "font-semibold text-gray-900" : "text-gray-700",
                  ].join(" ")}
                >
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RadioCard;
