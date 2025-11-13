import { parseUserInfo, refreshExp } from "@/hooks/common/getCookie";
import { useRefreshToken } from "@/hooks/common/useAPI";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "@/component/admin/common/header";
import Sidebar from "@/component/admin/common/sidebar/sidebar";
import { Admin } from "@/types/user";

const AdminLayout = () => {
  const admin = parseUserInfo() as Admin;
  const isRefresh = refreshExp();
  const refresh = useRefreshToken();
  const [toggleSidebar, setToggleSidebar] = useState(true);
  const canAccess = !!admin && admin.auth_type === "admin";

  useEffect(() => {
    if (!admin && isRefresh) {
      refresh()
        .then(() => {
          window.location.reload();
        })
        .catch(() => {});
    }
  }, []);

  if (!admin && !isRefresh && location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
    return null;
  }

  if (admin && !canAccess && location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
    return null;
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-row w-full h-full">
        <Sidebar toggleSidebar={toggleSidebar} />
        <main className="w-full flex flex-col items-center px-1 gap-6 bg-white">
          <AdminHeader setToggleSidebar={setToggleSidebar} />
          {/* 추후 추가될 수 있어서 context type으로 */}
          {/* 없으면 /admin/login 으로 리다이렉트 */}

          <Outlet context={{ admin }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
