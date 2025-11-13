import React from "react";
import SubLink from "./subLink";

interface LinkItem {
  to: string;
  label: string;
}

interface GroupProps {
  title: string;
  links: LinkItem[];
}

const Group: React.FC<GroupProps> = ({ title, links }) => (
  <div className="w-full pb-3">
    <div className="text-xl px-4 text-left text-white/90 rounded-lg font-semibold">
      {title}
    </div>
    <div className="mt-3 flex flex-col">
      {links.map((l, i) => (
        <SubLink key={i} to={l.to} label={l.label} />
      ))}
    </div>
  </div>
);

export default Group;
