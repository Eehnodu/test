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
const fmtDash = (d?: Date | null) =>
  d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : "";

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
  title?: string; // 아이콘 표시 여부만 결정 (있으면 아이콘 X)
  onChange?: (range: DateRange) => void;
  placeholder?: string; // 미사용(두 개 입력이므로), 필요시 확장 가능
  minDate?: Date;
  maxDate?: Date;
  /**
   * 사이즈 옵션
   * - lg: 기존(가장 큼, 기본값)
   * - md, sm: 더 작은 버전 2종
   */
  calendarSize?: "lg" | "md" | "sm";
}

// Tailwind 클래스 맵핑 (크기별 토큰)
const SIZE = {
  lg: {
    icon: "w-4 h-4",
    label: "text-lg",
    inputW: "w-32",
    inputPyPx: "px-3 py-1.5",
    inputText: "text-sm",
    calW: "w-[320px]",
    headerText: "text-sm",
    weekdayText: "text-[11px]",
    dayH: "h-9",
    dayText: "text-sm",
    footerBtnH: "h-10",
    closeIcon: "w-4 h-4",
    navIcon: "w-4 h-4",
    gap: "gap-2",
  },
  md: {
    icon: "w-4 h-4",
    label: "text-base",
    inputW: "w-28",
    inputPyPx: "px-2.5 py-1.5",
    inputText: "text-xs",
    calW: "w-[280px]",
    headerText: "text-xs",
    weekdayText: "text-[10px]",
    dayH: "h-8",
    dayText: "text-xs",
    footerBtnH: "h-9",
    closeIcon: "w-4 h-4",
    navIcon: "w-4 h-4",
    gap: "gap-1.5",
  },
  sm: {
    icon: "w-3.5 h-3.5",
    label: "text-sm",
    inputW: "w-24",
    inputPyPx: "px-2 py-1",
    inputText: "text-[11px]",
    calW: "w-[240px]",
    headerText: "text-[11px]",
    weekdayText: "text-[10px]",
    dayH: "h-7",
    dayText: "text-[11px]",
    footerBtnH: "h-8",
    closeIcon: "w-3.5 h-3.5",
    navIcon: "w-3.5 h-3.5",
    gap: "gap-1",
  },
} as const;

/**
 * 날짜 범위 선택(Date Range Picker)
 * - 입력필드는 항상 2개 (시작/종료).
 * - title 유무로 아이콘 표시만 결정:
 *    - title 있음: 라벨 + 두 입력 (아이콘 없음)
 *    - title 없음: 아이콘 + 두 입력
 * - calendarSize: 팝업 달력만 크기 변경 (입력창/타이틀은 그대로). 값: "lg"(기본), "md", "sm"
 */
export function DateRangePicker({
  value,
  title,
  onChange,
  placeholder = "yyyy.mm.dd ~ yyyy.mm.dd", // 유지만 함
  minDate,
  maxDate,
  calendarSize = "lg",
}: DateRangePickerProps) {
  const SZ = SIZE[calendarSize];

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"start" | "end" | null>(null); // 어느 인풋을 채우는지
  const [month, setMonth] = useState<Date>(() => value?.start ?? new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [tempRange, setTempRange] = useState<DateRange>(() => ({
    start: value?.start ?? null,
    end: value?.end ?? null,
  }));
  const rootRef = useRef<HTMLDivElement | null>(null);

  // 바깥 클릭시 닫기
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  // 열릴 때 현재 value로 임시 범위 초기화
  useEffect(() => {
    if (open)
      setTempRange({ start: value?.start ?? null, end: value?.end ?? null });
  }, [open, value]);

  // 열릴 때 포커스 방향 초기화
  useEffect(() => {
    if (!open) return;
    if (!tempRange.start) setActive("start");
    else if (!tempRange.end) setActive("end");
    else setActive("start");
  }, [open, tempRange.start, tempRange.end]);

  const cells = useMemo(() => getMonthMatrix(month), [month]);

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

    if (active === "start") {
      const end = tempRange.end;

      // ✅ 같은 날짜를 다시 누르면 단일일( start = end = d )로 접기
      if (isSameDay(d, tempRange.start) && end && !isSameDay(end, d)) {
        setTempRange({ start: d, end: d });
        setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
        return;
      }

      // 일반 업데이트
      if (end && +d > +end) {
        // start가 end보다 뒤면 스왑
        setTempRange({ start: end, end: d });
      } else {
        setTempRange({ start: d, end });
      }
      setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      return;
    }

    if (active === "end") {
      const start = tempRange.start;

      // ✅ 같은 날짜를 다시 누르면 단일일( start = end = d )로 접기
      if (isSameDay(d, tempRange.end) && start && !isSameDay(start, d)) {
        setTempRange({ start: d, end: d });
        setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
        return;
      }

      // 일반 업데이트
      if (start && +d < +start) {
        // end가 start보다 앞이면 스왑
        setTempRange({ start: d, end: start });
      } else {
        setTempRange({ start, end: d });
      }
      setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      return;
    }

    // active가 아직 없으면: 첫 클릭은 start 지정, 다음은 end로
    setActive("end");
    setTempRange({ start: d, end: null });
    setHoverDate(null);
    setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const confirm = () => {
    if (tempRange.start && tempRange.end) {
      onChange?.({ ...tempRange });
      setOpen(false);
    }
  };

  const reset = () => {
    setTempRange({ start: null, end: null });
    onChange?.({ start: null, end: null });
    setOpen(false);
  };

  const headerLabel = `${month.getFullYear()}년 ${month.getMonth() + 1}월`;

  return (
    <div className="relative" ref={rootRef}>
      {/* 상단 입력 영역: 항상 시작/종료 두 개. title 유무로 왼쪽에 라벨 vs 아이콘 */}
      <div className={`flex items-center ${SZ.gap}`}>
        {title ? (
          <span className={`text-lg font-bold text-black whitespace-nowrap`}>
            {title}
          </span>
        ) : (
          <CalendarIcon className={`w-4 h-4 text-gray-500`} />
        )}

        {/* 시작일 */}
        <input
          readOnly
          onClick={() => {
            setActive("start");
            setOpen(true);
          }}
          value={
            fmtDash(tempRange.start) ||
            (value?.start ? fmtDash(value.start) : "")
          }
          placeholder="YYYY-MM-DD"
          className={`w-32 px-3 py-1.5 rounded-md text-center text-sm placeholder-gray-400 border ${active === "start" && open ? "border-gray-500" : "border-gray-300"} focus:outline-none cursor-pointer`}
        />

        <span className="text-gray-500">~</span>

        {/* 종료일 */}
        <input
          readOnly
          onClick={() => {
            setActive("end");
            setOpen(true);
          }}
          value={
            fmtDash(tempRange.end) || (value?.end ? fmtDash(value.end) : "")
          }
          placeholder="YYYY-MM-DD"
          className={`w-32 px-3 py-1.5 rounded-md text-center text-sm placeholder-gray-400 border ${active === "end" && open ? "border-gray-500" : "border-gray-300"} focus:outline-none cursor-pointer`}
        />
      </div>

      {/* 모달 달력 */}
      {open && (
        // 왼쪽으로 이동 해야됨
        <div className="absolute left-0 top-full mt-2 z-50">
          <div
            className={`${SZ.calW} rounded-xl border border-gray-200 bg-white shadow-xl p-3`}
          >
            {/* Close Button */}
            <div className="flex justify-between px-1">
              <span className={`${SZ.headerText} font-medium text-gray-800`}>
                기간 설정
              </span>
              <button
                type="button"
                aria-label="달력 닫기"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                title="닫기"
              >
                <X className={SZ.closeIcon} />
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
                <ChevronLeft className={SZ.navIcon} />
              </button>

              <div className={`${SZ.headerText} font-medium text-gray-800`}>
                {headerLabel}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 rounded-md hover:bg-gray-100"
                  onClick={() => setMonth((m) => addMonths(m, 1))}
                  aria-label="다음 달"
                >
                  <ChevronRight className={SZ.navIcon} />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div
              className={`grid grid-cols-7 ${SZ.weekdayText} text-gray-500 px-1`}
            >
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
                    ? "bg-gray-700 text-white"
                    : inRange
                      ? "bg-gray-300 text-gray-700"
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
                      "relative",
                      SZ.dayH,
                      SZ.dayText,
                      "transition-colors",
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
                  className={`w-1/2 ${SZ.footerBtnH} px-3 rounded-md text-sm border border-gray-300 hover:bg-gray-50`}
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={!tempRange.start || !tempRange.end}
                  className={`w-1/2 ${SZ.footerBtnH} px-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed bg-gray-500 hover:bg-gray-700 text-white rounded-md`}
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
