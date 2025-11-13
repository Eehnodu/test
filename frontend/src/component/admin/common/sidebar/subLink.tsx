import React from "react";
import { NavLink } from "react-router-dom";

interface SubLinkProps {
  to: string;
  label: string;
}

const SubLink: React.FC<SubLinkProps> = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        [
          "flex items-center rounded-md px-4 py-1 text-lg text-center justify-center select-none transition-colors duration-200 mt-1",
          isActive
            ? "bg-[#D9D9D9] text-[#484848] font-semibold"
            : "text-white/80 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
};

export default SubLink;
