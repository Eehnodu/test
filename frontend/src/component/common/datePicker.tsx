// --- file: datePicker.tsx ---
import { useMemo, useRef, useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

/** Utils */
export const pad = (n: number) => String(n).padStart(2, "0");
export const fmt = (d?: Date | null) =>
  d ? `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}` : "";
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && +startOfDay(a) === +startOfDay(b);
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1);
const clampTime = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

function getMonthMatrix(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = new Date(first);
  const weekday = start.getDay(); // 0(Sun) ... 6(Sat)
  start.setDate(first.getDate() - weekday); // start from Sunday of the first row

  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return cells;
}

/** Types */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

/**
 * 날짜 범위 선택(Date Range Picker) 컴포넌트
 *
 * 시작일과 종료일을 지정할 수 있는 달력 UI입니다.
 * 달력 패널은 input을 클릭하면 열리고, 바깥 클릭 시 닫힙니다.
 * "확인" 버튼을 누르면 `onChange`를 통해 선택한 범위가 외부로 전달됩니다.
 *
 * ### Props
 * - `value` : 현재 선택된 범위 { start, end } (외부에서 제어 가능)
 * - `onChange` : 범위가 확정되었을 때 호출되는 콜백 `(range: { start: Date|null; end: Date|null }) => void`
 * - `placeholder` : input과 패널 상단에 표시할 placeholder (기본값: `"yyyy.mm.dd ~ yyyy.mm.dd"`)
 * - `minDate` : 선택할 수 있는 최소 날짜 (옵션)
 * - `maxDate` : 선택할 수 있는 최대 날짜 (옵션)
 * - `availableDates` : 선택할 수 있는 특정 날짜 배열 (옵션). 지정 시 이 배열에 없는 날짜는 비활성화됨.
 *
 * ### Behavior
 * - input 클릭 → 달력 패널 열림
 * - 바깥 클릭 → 달력 패널 닫힘
 * - ESC 키 처리 없음 (필요하면 추가 가능)
 * - 날짜 클릭:
 *   - 시작일이 없거나 시작·종료일이 모두 있으면 → 새로운 시작일 설정
 *   - 시작일만 있으면 → 클릭한 날짜를 종료일로 설정 (시작일보다 전이면 자동으로 순서 보정)
 * - Hover 상태에서 종료일 미리보기 가능
 * - "취소" 버튼 → 선택 초기화 (`{ start: null, end: null }`) 후 닫힘
 * - "확인" 버튼 → `onChange` 실행 후 닫힘
 *
 * ### Usage
 * ```tsx
 * import { useState } from "react";
 * import { DateRangePicker, DateRange } from "@/components/datePicker";
 *
 * const [range, setRange] = useState<DateRange>({ start: null, end: null });
 *
 * <DateRangePicker
 *   value={range}
 *   onChange={setRange}
 *   minDate={new Date(2024, 0, 1)}
 *   maxDate={new Date(2025, 11, 31)}
 *   placeholder="날짜를 선택하세요"
 * />
 * ```
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = "yyyy.mm.dd ~ yyyy.mm.dd",
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(() => value?.start ?? new Date());
  const [tempRange, setTempRange] = useState<DateRange>(() => ({
    start: value?.start ?? null,
    end: value?.end ?? null,
  }));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // Reset temp range when opening
  useEffect(() => {
    if (open)
      setTempRange({ start: value?.start ?? null, end: value?.end ?? null });
  }, [open, value]);

  const cells = useMemo(() => getMonthMatrix(month), [month]);

  const displayText =
    tempRange.start && tempRange.end
      ? `${fmt(tempRange.start)} ~ ${fmt(tempRange.end)}`
      : value?.start && value?.end
        ? `${fmt(value.start)} ~ ${fmt(value.end)}`
        : "";

  const inPreviewRange = (d: Date) => {
    const s = tempRange.start;
    const e = tempRange.end ?? hoverDate;
    if (!s || !e) return false;
    const a = +clampTime(s);
    const b = +clampTime(e);
    const x = +clampTime(d);
    return a <= x && x <= Math.max(a, b) && x >= Math.min(a, b);
  };

  const isDisabled = (d: Date) => {
    const t = +clampTime(d);
    if (minDate && t < +clampTime(minDate)) return true;
    if (maxDate && t > +clampTime(maxDate)) return true;
    return false;
  };

  const handleSelect = (d: Date) => {
    if (isDisabled(d)) return;

    if (!tempRange.start || (tempRange.start && tempRange.end)) {
      setTempRange({ start: d, end: null });
      setHoverDate(null);
      setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      return;
    }

    // selecting end
    if (tempRange.start && !tempRange.end) {
      if (+d < +tempRange.start) {
        setTempRange({ start: d, end: tempRange.start });
      } else {
        setTempRange({ start: tempRange.start, end: d });
      }
    }
  };

  const confirm = () => {
    if (tempRange.start && tempRange.end) {
      onChange?.({ ...tempRange });
      setOpen(false);
    }
  };

  // 취소 버튼을 초기화 동작으로 변경
  const reset = () => {
    setTempRange({ start: null, end: null });
    onChange?.({ start: null, end: null });
    setOpen(false);
  };

  const headerLabel = `${month.getFullYear()}년 ${month.getMonth() + 1}월`;

  return (
    <div className="relative" ref={rootRef}>
      <div className="relative">
        <CalendarIcon className="w-4 h-4 text-gray-500 absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          readOnly
          onClick={() => setOpen((v) => !v)}
          value={displayText}
          placeholder={placeholder}
          className=" w-full pl-9 pr-8 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-gray-500 cursor-pointer"
        />
      </div>

      {open && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center">
          <div className="w-[320px] rounded-xl border border-gray-200 bg-white shadow-xl p-3">
            {/* Close Button */}
            <div className="flex justify-between px-1">
              <span className="text-sm font-medium text-gray-800">
                기간 설정
              </span>
              <button
                type="button"
                aria-label="달력 닫기"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Month Header */}
            <div className="flex items-center justify-between px-1 py-1.5">
              <button
                type="button"
                className="p-1 rounded-md hover:bg-gray-100"
                onClick={() => setMonth((m) => addMonths(m, -1))}
                aria-label="이전 달"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-sm font-medium text-gray-800">
                {headerLabel}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 rounded-md hover:bg-gray-100"
                  onClick={() => setMonth((m) => addMonths(m, 1))}
                  aria-label="다음 달"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 text-[11px] text-gray-500 px-1">
              {"일월화수목금토".split("").map((w) => (
                <div key={w} className="h-6 flex items-center justify-center">
                  {w}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 p-1">
              {cells.map((d) => {
                const isOtherMonth = d.getMonth() !== month.getMonth();
                const selectedStart = isSameDay(d, tempRange.start);
                const selectedEnd = isSameDay(d, tempRange.end);
                const inRange = inPreviewRange(d);

                const isSingle = selectedStart && selectedEnd;
                const roundedClass = isSingle
                  ? "rounded-md"
                  : selectedStart
                    ? "rounded-l-md"
                    : selectedEnd
                      ? "rounded-r-md"
                      : "rounded-none";

                const bgClass =
                  selectedStart || selectedEnd
                    ? "bg-[#6366F1] text-white"
                    : inRange
                      ? "bg-[#DFE0FE] text-[#484BFD]"
                      : "";

                return (
                  <button
                    key={+d}
                    type="button"
                    onMouseEnter={() => setHoverDate(d)}
                    onFocus={() => setHoverDate(d)}
                    onMouseLeave={() => setHoverDate(null)}
                    onClick={() => handleSelect(d)}
                    disabled={isDisabled(d)}
                    className={[
                      "relative h-9 text-sm transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
                      isOtherMonth ? "text-gray-300" : "text-gray-700",
                      roundedClass,
                      bgClass,
                      isDisabled(d) ? "opacity-40 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 pt-2 w-full">
              <div className="w-full flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="w-1/2 h-10 px-3 rounded-md text-sm border border-gray-300 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={!tempRange.start || !tempRange.end}
                  className="w-1/2 h-10 px-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed bg-[#6366F1] text-white rounded-md"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 필요한 건가?
// export const DateUtils = { fmt };
