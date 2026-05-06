import { NavLink } from "react-router-dom";

const linkClass =
  "block rounded-lg px-3 py-2 text-sm transition hover:bg-white/10 [&.active]:bg-cyan-500/15 [&.active]:text-cyan-300";

const STUDENT_ITEMS = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/my-courses", label: "My courses" },
  { to: "/dashboard/assignments", label: "Assignments" },
  { to: "/dashboard/quizzes", label: "Quizzes" },
  { to: "/dashboard/forum", label: "Forum" },
  { to: "/dashboard/messages", label: "Messages" },
  { to: "/dashboard/notifications", label: "Notifications" },
  { to: "/dashboard/calendar", label: "Calendar" },
  { to: "/dashboard/certificates", label: "Certificates" },
  { to: "/dashboard/leaderboard", label: "Leaderboard" },
  { to: "/dashboard/profile", label: "Profile" },
];

const INSTRUCTOR_ITEMS = [
  { to: "/instructor/dashboard", label: "Overview", end: true },
  { to: "/instructor/panel", label: "Courses & curriculum" },
  { to: "/instructor/assignments", label: "Assignments & quizzes" },
  { to: "/instructor/attendance", label: "Attendance" },
  { to: "/instructor/grading", label: "Grading" },
  { to: "/instructor/certificates", label: "Certificates" },
  { to: "/courses", label: "Course catalog" },
  { to: "/instructor/profile", label: "Profile" },
];

const ADMIN_ITEMS = [
  { to: "/admin/dashboard", label: "Analytics", end: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/courses", label: "Course approvals" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/reports", label: "Complaints & reports" },
  { to: "/admin/settings", label: "Platform settings" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/profile", label: "Profile" },
];

const SidebarNav = ({ variant }) => {
  const items =
    variant === "student" ? STUDENT_ITEMS : variant === "instructor" ? INSTRUCTOR_ITEMS : ADMIN_ITEMS;

  return (
    <aside className="w-full shrink-0 border-b border-white/10 bg-slate-950/95 p-3 md:w-56 md:border-b-0 md:border-r md:border-white/10">
      <p className="hidden md:block mb-4 text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {variant === "student" ? "Student" : variant === "instructor" ? "Instructor" : "Admin"}
      </p>
      <nav className="flex flex-row gap-1 overflow-x-auto pb-1 md:flex-col md:space-y-1 md:pb-0">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={`${linkClass} whitespace-nowrap`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarNav;
