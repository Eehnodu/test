import { Admin, User } from "@/types/user";

const getCookie = (name: string): string | undefined => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)`));
  return match ? match[2].trim() : undefined;
};

export const parseUserInfo = (): User | Admin | null => {
  const cookie = getCookie("user_info");
  if (!cookie) return null;
  try {
    const binary = atob(cookie.replace(/^"|"$/g, ""));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("쿠키 파싱 실패:", e);
    return null;
  }
};

export const refreshExp = () => {
  const cookie = getCookie("refresh_exp");
  if (!cookie) return false;
  return true;
};