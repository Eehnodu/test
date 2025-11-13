import { ReactNode } from "react";

interface TableLineProps {
  children: ReactNode;
  as?: "header" | "row";
  hoverable?: boolean;
  className?: string;
}

/**
 * 테이블의 한 줄을 렌더링하는 컴포넌트.
 *
 * - `as="header"`일 경우 헤더 스타일을 적용
 * - `as="row"`일 경우 일반 행 스타일을 적용
 * - `hoverable`을 true로 설정하면 hover/active 시 배경색과 커서 포인터가 표시됨
 *
 * @component
 * @example
 * ```tsx
 * <TableLine as="header">
 *   <span>이름</span>
 *   <span>나이</span>
 * </TableLine>
 *
 * <TableLine as="row" hoverable>
 *   <span>홍길동</span>
 *   <span>20</span>
 * </TableLine>
 * ```
 */
const TableLine = ({
  children,
  as = "row",
  hoverable = false,
  className = "",
}: TableLineProps) => {
  const isHeader = as === "header";

  const baseClass = isHeader
    ? "h-8 py-2 border-b border-b-gray-600 compact-xs-medium text-gray-700"
    : `h-[50px] py-3 bg-white border-b border-b-gray-200 text-black ${
        hoverable ? "hover:bg-gray-100 active:bg-gray-200 cursor-pointer" : ""
      }`;

  return (
    <div
      className={`w-full flex justify-between px-4 items-center ${baseClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default TableLine;
