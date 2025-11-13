export type SortOption =
  | "created_at"
  | "user_nickname"
  | "registered_at"
  | "price_high";

type Props = {
  value: SortOption;
  options?: SortOption[];
  onChange: (value: SortOption) => void;
};

const SortSelector = ({
  value,
  options = ["created_at", "user_nickname", "registered_at", "price_high"],
  onChange,
}: Props) => (
  <fieldset className="shrink-0">
    <legend className="sr-only">정렬</legend>
    <div className="flex items-center gap-4">
      {options.map((opt) => (
        <label
          key={opt}
          className="inline-flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name="sort"
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="peer hidden"
          />
          <span
            className="
    relative inline-block h-4 w-4 rounded-full border border-gray-400
    peer-checked:border-gray-700
    before:content-[''] before:absolute before:top-1/2 before:left-1/2
    before:h-2 before:w-2 before:rounded-full before:bg-black
    before:scale-0 peer-checked:before:scale-100
    before:-translate-x-1/2 before:-translate-y-1/2 before:transform
    before:transition-transform
  "
          />
          <span className="text-sm text-gray-700 font-semibold">
            {opt === "created_at"
              ? "가입 일자 (최근 일자순)"
              : opt === "user_nickname"
                ? "유저명 (가나다 순)"
                : opt === "registered_at"
                  ? "등록 일자 (최신 순)"
                  : "가격 높은 순"}
          </span>
        </label>
      ))}
    </div>
  </fieldset>
);

export default SortSelector;
