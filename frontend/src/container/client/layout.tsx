import { parseUserInfo, refreshExp } from "@/hooks/common/getCookie";
import { useGet, useRefreshToken } from "@/hooks/common/useAPI";
import { BaseUser } from "@/types/user";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  const user = parseUserInfo();
  const isRefresh = refreshExp();
  const refresh = useRefreshToken();

  // 유저 정보 없고, 리프레시 토큰이 남아있는 경우에
  useEffect(() => {
    if (!user && isRefresh) {
      refresh()
        .then(() => {
          window.location.reload();
        })
        .catch(() => {});
    }
  }, []);

  const { data: meData } = useGet<BaseUser>("api/user/me", ["meData"], !!user);

  return (
    <div className="flex flex-col max-w-[768px] h-full bg-gradient-to-b from-[#8F53FF] to-[#1A0148] relative text-white ">
      <main className="flex w-full min-h-[calc(100svh-70px)] p-5 pb-10 flex-col overflow-y-auto">
        {/* 추후 추가될 수 있어서 context type으로 */}
        <Outlet context={{ user, meData }} />
      </main>
    </div>
  );
};

export default ClientLayout;
