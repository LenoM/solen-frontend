import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type SidebarItemProps = {
  label: string;
  path: string;
  icon: ReactNode;
};

const SidebarItem = ({ label, path, icon }: SidebarItemProps) => {
  const navigate = useNavigate();
  const Icon = () => icon;

  return (
    <li>
      <a
        onClick={() => navigate(path)}
        className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
      >
        <Icon />
        <span className="ms-3">{label}</span>
      </a>
    </li>
  );
};

export default SidebarItem;
