import { ReactNode } from "react";
import { Link } from "react-router-dom";

type SidebarItemProps = {
  label: string;
  path: string;
  icon: ReactNode;
};

const SidebarItem = ({ label, path, icon }: SidebarItemProps) => {
  const Icon = () => icon;

  return (
    <li>
      <Link
        to={path}
        className="flex items-center p-2 pl-0 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        <Icon />
        <span className="ms-3">{label}</span>
      </Link>
    </li>
  );
};

export default SidebarItem;
