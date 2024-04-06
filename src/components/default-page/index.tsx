import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar";

export default function Layout() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}
