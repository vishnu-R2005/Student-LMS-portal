import { Outlet } from "react-router-dom";
import SidebarNav from "../components/SidebarNav";

const StudentLayoutShell = () => (
  <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col bg-slate-950 text-white md:flex-row">
    <SidebarNav variant="student" />
    <div className="flex-1 min-w-0 overflow-x-auto p-4 md:p-8">
      <Outlet />
    </div>
  </div>
);

export default StudentLayoutShell;
