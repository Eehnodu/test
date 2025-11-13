import React from "react";
import { ADMIN_MENU } from "@/component/admin/common/adminMenu";
import Group from "./group";

interface SidebarProps {
  toggleSidebar: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  return (
    <aside
      className={[
        "relative h-full transition-[width] duration-300 ease-in-out",
        toggleSidebar ? "w-72" : "w-0",
        toggleSidebar ? "" : "pointer-events-none",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-0",
          "transition-transform duration-300 ease-in-out will-change-transform",
          toggleSidebar ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="h-full w-full bg-[#262626] text-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="h-20 flex items-center justify-center bg-[#171717] rounded-t-2xl">
            <span className="text-2xl font-medium">Menu</span>
          </div>

          <div className="flex-1 px-4 py-8 flex flex-col gap-3">
            {ADMIN_MENU.map((item, idx) => (
              <Group key={idx} title={item.title} links={item.children} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
