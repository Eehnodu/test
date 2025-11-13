import { ButtonHTMLAttributes, ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none disabled:cursor-not-allowed",
  variants: {
    variant: {
      solid:
        "bg-black text-white hover:bg-gray-900 hover:text-gray-200 active:bg-gray-800 active:text-gray-500 disabled:bg-gray-30 disabled:text-gray-500 ",
      outlined:
        "bg-white border border-gray-500 text-gray-900 hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-white disabled:border-gray-300 disabled:text-gray-400 ",
      transparented: "hover:bg-black-4 active:bg-black-8 disabled:text-gray-40",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-5 text-base",
    },
    intent: {
      primary: "",
      secondary: "text-gray-600",
    },
    full: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
    intent: "primary",
  },
});

type ButtonVariants = VariantProps<typeof button>;

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

/**
 * 범용 Button 컴포넌트
 *
 * Tailwind Variants(`tv`) 기반으로 스타일 변형을 관리합니다.
 *
 * ### Props
 * - `variant` : 버튼 스타일 ( `"solid"` | `"outlined"` | `"transparented"` )
 * - `intent` : 버튼 톤/의미 ( `"primary"` | `"secondary"` )
 * - `size` : 버튼 크기 ( `"sm"` | `"md"` | `"lg"` )
 * - `full` : `true`면 부모의 width를 가득 채움
 * - `leftIcon` : 버튼 왼쪽에 들어갈 아이콘 (ReactNode)
 * - `rightIcon` : 버튼 오른쪽에 들어갈 아이콘 (ReactNode)
 * - `className` : 추가 Tailwind 클래스 (tailwind-merge로 병합됨)
 * - 그 외 기본 `button` HTML 속성 (`onClick`, `disabled` 등)
 *
 * ### Usage
 * ```tsx
 * import { ArrowRight, Plus } from "lucide-react";
 *
 * // 기본 사용
 * <Button>기본 버튼</Button>
 *
 * // variant + intent 조합
 * <Button variant="outlined" intent="secondary">취소</Button>
 *
 * // 아이콘 포함
 * <Button size="lg" variant="solid" leftIcon={<Plus />}>
 *   추가하기
 * </Button>
 *
 * // 오른쪽 아이콘
 * <Button rightIcon={<ArrowRight />}>
 *   다음 단계
 * </Button>
 *
 * // 전체 너비
 * <Button full>확인</Button>
 * ```
 */
const Button = ({
  variant,
  intent,
  size,
  full,
  children,
  leftIcon,
  rightIcon,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={button({ variant, intent, size, full, className })}
      {...rest}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children && <span className="truncate">{children}</span>}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
