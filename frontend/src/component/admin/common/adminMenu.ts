export interface SimpleLinkItem {
  label: string;
  to: string;
}

export type AdminMenuItem =
  | {
      type: "group";
      title: string;
      children: SimpleLinkItem[];
    }
  | {
      type: "link";
      label: string;
      to: string;
    };

export const ADMIN_MENU: AdminMenuItem[] = [
  {
    type: "link",
    label: "회원 관리",
    to: "/admin/users",
  },
  {
    type: "link",
    label: "GPT 설정",
    to: "/admin/gpt",
  },
];

export const ROUTE_TITLES = {
  "/admin/users": "회원 관리",
  "/admin/gpt": "GPT 설정",
};

export const getTitleByPath = (pathname: string) => {
  const key = Object.keys(ROUTE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname === k || pathname.startsWith(k + "/"));
  return ROUTE_TITLES[key as keyof typeof ROUTE_TITLES] || "Unknown Mode";
};
