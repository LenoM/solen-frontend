import { features } from "../../features";
import SidebarItem from "./sidebar-item";

export default function Sidebar() {
  return (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <h5
            id="drawer-navigation-label"
            className="mb-4 text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
          >
            Menu
          </h5>
          <ul className="space-y-2 font-medium">
            {features
              .filter((feat) => feat.isMenuItem === true)
              .map((menu, key) => {
                return (
                  <SidebarItem
                    label={menu.label}
                    path={menu.path}
                    key={key}
                    icon={menu.icon}
                  />
                );
              })}
          </ul>
        </div>
      </aside>
    </>
  );
}
