import { pad } from "./date";
import { Option } from "@/component/client/miuai/miuBeat/dropdown";

/**
 * HH:mm:ss (예: 01:23:45)
 */
export function formatTimeFull(seconds: number): string {
  if (isNaN(seconds)) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * mm:ss (예: 03:42)
 */
export function formatTimeShort(seconds: number): string {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * 한글 표기 (예: 1시간 3분 42초)
 */
export function formatTimeKorean(seconds: number): string {
  if (isNaN(seconds)) return "0초";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts = [];
  if (h) parts.push(`${h}시간`);
  if (m) parts.push(`${m}분`);
  if (s || parts.length === 0) parts.push(`${s}초`);
  return parts.join(" ");
}

/**
 * 영어 표기 (예: 1h 3m 42s)
 */
export function formatTimeEnglish(seconds: number): string {
  if (isNaN(seconds)) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s || parts.length === 0) parts.push(`${s}s`);
  return parts.join(" ");
}

/**
 * 자동 (1시간 미만이면 mm:ss, 이상이면 HH:mm:ss)
 */
export function formatTimeAuto(seconds: number): string {
  if (isNaN(seconds)) return "00:00";
  return seconds >= 3600 ? formatTimeFull(seconds) : formatTimeShort(seconds);
}

/**
 * 시간 옵션 생성
 * @param n 옵션 개수
 * @param unit 단위
 * @returns 옵션 배열
 */
export function makeTimeOptions(n: number, unit: string): Option[] {
  return Array.from({ length: n }, (_, i) => ({
    value: i,
    label: `${pad(i)}${unit}`,
  }));
}
/**
 * 시간 파싱
 * @param t 시간 문자열
 * @returns 시간 객체
 */
export function parseInitialTime(t?: string) {
  const def = "05:59";
  const [h, m] = (t ?? def).split(":").map(Number);
  return { h: Number.isFinite(h) ? h : 5, m: Number.isFinite(m) ? m : 59 };
}
