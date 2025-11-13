import { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectCardProps {
  title: string;
  required?: boolean;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  border?: boolean;
  description?: string;
  placeholder?: string;
}

const SelectCard = ({
  title,
  required,
  options,
  value,
  onChange,
  description,
  border = true,
  placeholder = "옵션을 선택하세요",
}: SelectCardProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  return (
    <section
      className={[
        "w-full rounded-2xl px-5 py-4 bg-white",
        border ? "border border-gray-200 shadow-sm" : "",
      ].join(" ")}
    >
      {/* 타이틀 */}
      <header className="mb-2 flex items-center gap-2">
        <span className="text-[10px] leading-none text-gray-900">●</span>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {required && <span className="text-xs text-red-500">(필수)</span>}
      </header>

      {description && (
        <p className="mb-2 text-xs text-gray-500 ml-4">{description}</p>
      )}

      {/* 셀렉트 박스 */}
      <div className="relative max-w-sm ml-4">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="
            flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm
            bg-white text-gray-900 border border-gray-300
          "
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
            {displayLabel}
          </span>
          <span className="ml-2 text-xs text-gray-500">{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div className="absolute left-0 right-0 z-20 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg">
            <div className="max-h-[224px] overflow-y-auto py-1">
              {options.map((opt) => {
                const active = opt.value === value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={[
                      "w-full px-3 py-2 text-left text-sm transition-colors",
                      active
                        ? "bg-gray-100 font-semibold text-gray-900"
                        : "text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SelectCard;
