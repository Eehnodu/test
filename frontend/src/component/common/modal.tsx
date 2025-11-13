import { useEffect } from "react";
import Button from "./button";

interface ModalProps {
  numbers: 1 | 2;
  title?: string;
  description?: string;
  description2?: string;
  warning?: string;
  label?: string;
  label2?: string;
  onClose: () => void;
  onClick?: () => void;
  icon?: string;
  btn1?: string;
  btn2?: string;
  className?: string;
}

/**
 * 범용 Modal 컴포넌트
 *
 * 화면 중앙에 다이얼로그 형태로 표시되며, 배경 클릭이나 ESC 키로 닫을 수 있습니다.
 * `numbers` props에 따라 버튼 구성이 달라집니다.
 *
 * ### Props
 * - `numbers` : 버튼 개수 ( `1` | `2` )
 *   - `1` → 확인 버튼만 표시
 *   - `2` → 취소/확인 버튼 모두 표시
 * - `title` : 모달 제목
 * - `description` : 설명 문구 (옵션)
 * - `description2` : 추가 설명 문구 (옵션)
 * - `warning` : 경고 문구 (빨간색으로 표시, 옵션)
 * - `label` : 첫 번째 버튼(확인/취소)의 텍스트 (기본값: `"확인"`)
 * - `label2` : 두 번째 버튼의 텍스트 (옵션, 기본값: `"취소"`)
 * - `onClose` : 닫기 핸들러 (필수)
 * - `onClick` : 확인 버튼 클릭 시 실행되는 핸들러 (옵션)
 * - `icon` : 아이콘 이미지 경로 (옵션)
 * - `closeOnOutside` : 바깥 영역 클릭 시 닫기 여부 (현재 코드에선 사용 안 됨)
 *
 * ### Behavior
 * - 마운트 시 body 스크롤을 잠금
 * - 언마운트 시 스크롤 원복
 * - ESC 키를 누르면 자동으로 닫힘
 *
 * ### Usage
 * ```tsx
 * import Modal from "@/components/Modal";
 *
 * // 확인 버튼만 있는 모달
 * <Modal
 *   numbers={1}
 *   title="알림"
 *   description="정말로 삭제하시겠습니까?"
 *   onClose={() => setOpen(false)}
 * />
 *
 * // 확인 + 취소 버튼이 있는 모달
 * <Modal
 *   numbers={2}
 *   title="경고"
 *   description="삭제 후에는 복구할 수 없습니다."
 *   warning="이 작업은 되돌릴 수 없습니다."
 *   label="취소"
 *   label2="삭제"
 *   onClose={() => setOpen(false)}
 *   onClick={handleDelete}
 * />
 * ```
 */
const Modal = ({
  numbers = 1,
  title,
  description,
  description2,
  warning,
  label = "확인",
  label2 = "취소",
  onClose,
  onClick,
  icon,
  btn1,
  btn2,
  className,
}: ModalProps) => {
  // 마운트 동안 스크롤 잠금
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-modal-bg z-10">
      <div className="w-full h-full flex items-center justify-center">
        <div
          className={`w-[400px] flex flex-col items-center rounded-2xl shadow-popup bg-white ${className}`}
        >
          <div className="flex flex-col items-center p-6 pb-0 gap-[6px]">
            {icon && (
              <div className="shrink-0 rounded-full bg-gray-100 p-2 text-gray-70">
                <img src={icon} alt="" />
              </div>
            )}
            <span className="font-semibold">{title}</span>
            <div className="flex flex-col">
              <span className="body-md-medium text-gray-800 whitespace-pre-line text-center">
                {description}
              </span>
              {description2 && (
                <span className="body-md-medium text-gray-800 whitespace-pre-line text-center select-text">
                  {description2}
                </span>
              )}
              {warning && (
                <p className="mt-2 text-center text-[13px] leading-5 text-red-600 whitespace-pre-line">
                  {warning}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-row w-full items-center justify-center px-11 py-6 gap-2">
            {numbers == 1 ? (
              <Button
                variant="solid"
                color="brand"
                size="lg"
                className={`${btn1} w-full`}
                children={label}
                onClick={onClose}
              />
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="lg"
                  className={`${btn1} w-1/2`}
                  children={label}
                  onClick={onClose}
                />
                <Button
                  variant="solid"
                  color="brand"
                  size="lg"
                  className={`${btn2} w-1/2`}
                  children={label2}
                  onClick={onClick}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
