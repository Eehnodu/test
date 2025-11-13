import { ButtonHTMLAttributes, ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const tab = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none border border-brand",
  variants: {
    selected: {
      true: "bg-black text-white",
      false:
        "text-gray-600 hover:bg-gray-100 hover:text-gray-700 active:bg-gray-200 active:text-gray-800 ",
    },
    size: {
      sm: "h-8 px-5 text-sm",
      md: "h-10 px-5 text-sm",
      lg: "h-11 px-5 text-base",
    },
  },
  defaultVariants: {
    selected: false,
    size: "md",
  },
});

type TabVariants = VariantProps<typeof tab>;

export interface TabProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    TabVariants {
  children: ReactNode;
  selected?: boolean;
  id?: string;
}

/**
 * 범용 Tab 컴포넌트
 *
 * WAI-ARIA `role="tab"` 속성을 포함한 버튼형 탭 컴포넌트입니다.
 * Tailwind Variants(`tv`) 기반으로 스타일 변형을 관리합니다.
 *
 * ### Props
 * - `selected` : 탭이 현재 활성화(선택) 상태인지 여부 (기본값: `false`)
 * - `size` : 탭 크기 ( `"sm"` | `"md"` | `"lg"` )
 * - `id` : 탭의 고유 id (접근성: `aria-controls`와 연결할 때 사용)
 * - `className` : 추가 Tailwind 클래스 (tailwind-merge로 병합됨)
 * - 그 외 기본 `button` HTML 속성 (`onClick`, `disabled` 등)
 *
 * ### Usage
 * ```tsx
 * // 기본 사용
 * <Tab>탭 1</Tab>
 *
 * // 선택 상태
 * <Tab selected className="aria-selected:text-white">탭 선택됨</Tab>
 *
 * // 크기 지정
 * <Tab size="lg">큰 탭</Tab>
 *
 * // TabList 안에서 사용 예시
 * <div role="tablist">
 *   <Tab id="tab-1" selected>탭 1</Tab>
 *   <Tab id="tab-2">탭 2</Tab>
 * </div>
 * ```
 */
const Tab = ({
  children,
  selected = false,
  size,
  id,
  className,
  ...rest
}: TabProps) => {
  return (
    <button
      role="tab"
      id={id}
      aria-selected={selected}
      className={tab({ selected, size, className })}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Tab;