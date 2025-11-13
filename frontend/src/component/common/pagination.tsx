import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  onPageChange: (newPage: number) => void;
  perPage?: number;
  className?: string;
  groupSize?: number;
}

/**
 * Pagination 컴포넌트
 *
 * 좌/우 화살표(`LeftArrow`, `RightArrow`)와 페이지 번호 버튼을 포함한 페이지네이션 UI입니다.
 * 페이지 번호는 `groupSize` 단위로 나누어 표시됩니다.
 *
 * ### Props
 * - `page` : 현재 페이지 번호 (1부터 시작)
 * - `total` : 전체 아이템 수
 * - `onPageChange` : 페이지 변경 시 실행되는 콜백 `(newPage: number) => void`
 * - `perPage` : 한 페이지당 아이템 수 (기본값 `12`)
 * - `groupSize` : 한 그룹에서 보여줄 페이지 수 (기본값 `5`)
 * - `className` : 외부에서 추가 스타일 지정 시 사용
 *
 * ### Usage
 * ```tsx
 * const [page, setPage] = useState(1);
 *
 * <Pagination
 *   page={page}
 *   total={120}
 *   perPage={10}
 *   groupSize={7}
 *   onPageChange={(newPage) => setPage(newPage)}
 * />
 * ```
 */
const Pagination = ({
  page,
  total,
  onPageChange,
  perPage = 12,
  className,
  groupSize = 5,
}: PaginationProps) => {
  const totalPage = Math.max(Math.ceil(total / perPage), 1);

  // 현재 그룹 계산
  const currentGroup = Math.floor((page - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPage);

  // 현재 그룹 페이지 목록 만들기
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div
      className={`h-11 p-4 gap-2 w-full flex items-center justify-center ${className}`}
    >
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`w-9 h-9  text-black flex items-center justify-center rounded-full ${
            page === pageNum ? "bg-gray-100" : ""
          }`}
        >
          {pageNum}
        </button>
      ))}

      <button
        disabled={page === totalPage}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
