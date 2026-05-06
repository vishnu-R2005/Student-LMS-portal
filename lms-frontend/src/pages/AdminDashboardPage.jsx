import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api
      .get("/learning/analytics/admin/")
      .then(({ data }) => setStats(data))
      .catch(() => toast.error("Analytics unavailable"));
  }, []);

  if (!stats)
    return <p className="text-white/60">Loading platform analytics…</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Platform overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Pending approvals", stats.pending_courses],
          ["Live courses", stats.approved_courses],
          ["Open reports", stats.open_reports],
          ["Total enrollments", stats.total_enrollments],
          ["Collected revenue", stats.paid_revenue_total],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <p className="text-xs uppercase tracking-wide text-white/40">{k}</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-300">{String(v)}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-white/70 mb-2">Users by role</p>
        <ul className="flex flex-wrap gap-3 text-sm text-white/60">
          {Object.entries(stats.users_by_role || {}).map(([role, count]) => (
            <li key={role}>
              <span className="text-cyan-200">{role}</span>: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
