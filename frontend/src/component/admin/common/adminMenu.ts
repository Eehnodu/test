export const ADMIN_MENU = [
  {
    type: "group",
    title: "회원",
    children: [
      { label: "회원 관리", to: "/admin/users" },
      { label: "AI 모델 사용 내역", to: "/admin/logs" },
    ],
  },
  {
    type: "group",
    title: "상품",
    children: [
      { label: "상품 관리", to: "/admin/avatars" },
      { label: "거래 내역", to: "/admin/payments" },
    ],
  },
  {
    type: "group",
    title: "공지사항",
    children: [{ label: "공지사항 관리", to: "/admin/notices" }],
  },
];

export const ROUTE_TITLES = {
  "/admin/users": "회원 관리",
  "/admin/logs": "AI 모델 사용 내역",
  "/admin/avatars": "상품 관리",
  "/admin/payments": "거래 내역",
  "/admin/notices": "공지사항 관리",
};

export const getTitleByPath = (pathname: string) => {
  const key = Object.keys(ROUTE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname === k || pathname.startsWith(k + "/"));
  return ROUTE_TITLES[key as keyof typeof ROUTE_TITLES] || "Unknown Mode";
};
