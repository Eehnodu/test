/**
 * ₩12,345
 */
export function formatCurrencyKRW(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "₩0";
  return `₩${value.toLocaleString("ko-KR")}`;
}

/**
 * $12,345
 */
export function formatCurrencyUSD(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "$0";
  return `$${value.toLocaleString("en-US")}`;
}

/**
 * 12,345원
 */
export function formatNumberKRW(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "0원";
  return `${value.toLocaleString("ko-KR")}원`;
}

/**
 * 12,345
 */
export function formatNumber(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "0";
  return `${value.toLocaleString("ko-KR")}`;
}

/**
 * 12,345달러
 */
export function formatNumberUSD(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "0달러";
  return `${value.toLocaleString("en-US")}달러`;
}

/**
 * 12,345 point
 */

export function formatNumberPointEN(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "0포인트";
  return `${value.toLocaleString("ko-KR")} point`;
}

/**
 * 12,345 포인트
 */
export function formatNumberPointKR(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "0원";
  return `${value.toLocaleString("ko-KR")} 포인트`;
}
