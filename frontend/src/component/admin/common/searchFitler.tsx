import { memo, useCallback, KeyboardEvent } from "react";
import Button from "@/component/common/button";
import { Search } from "lucide-react";
import { DateRangePicker, type DateRange } from "@/component/common/datePicker";

type Option = { value: string; label: string };

type Props = {
  searchType: string;
  onSearchTypeChange: (v: string) => void;

  searchValue: string;
  onSearchValueChange: (v: string) => void;

  onSubmit: () => void;

  /** 셀렉트 옵션 (페이지별로 다름) */
  searchTypeOptions: Option[];

  /** 부모에서 Tailwind 등으로 여백 제어하고 싶을 때 */
  className?: string;
};

function SearchFilter({
  searchType,
  onSearchTypeChange,
  searchValue,
  onSearchValueChange,
  onSubmit,
  searchTypeOptions,
  className,
}: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSubmit();
    },
    [onSubmit]
  );

  return (
    <header className={className ?? "w-full border-gray-200"}>
      <div className="ml-auto w-fit flex items-end gap-2 sm:gap-3">
        {/* 검색 범주 */}
        <select
          className="h-10 border border-gray-300 rounded-md px-3 text-sm text-gray-700 focus:outline-none focus:border-gray-500"
          value={searchType}
          aria-label="검색 범주"
          onChange={(e) => onSearchTypeChange(e.target.value)}
        >
          {searchTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* 검색창 + 아이콘 버튼 */}
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden h-10">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="flex-1 px-3 text-sm placeholder-gray-400 focus:outline-none"
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={onSubmit}
            aria-label="검색"
            className="w-10 h-full flex items-center justify-center hover:bg-gray-50"
          >
            <Search className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default memo(SearchFilter);
