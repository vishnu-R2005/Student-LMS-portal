import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ProgressBar from "../components/ProgressBar";
import api from "../services/api";

const DashboardPage = () => {
  const [dashboard, setDashboard] = useState({
    enrollments: [],
    recent_activity: [],
  });
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/enrollments/dashboard/"),
      api.get("/learning/workspace/student/"),
    ])
      .then(([d1, d2]) => {
        setDashboard(d1.data);
        setWorkspace(d2.data);
      })
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const avgProgress =
    dashboard.enrollments.length > 0
      ? Math.round(
          dashboard.enrollments.reduce(
            (acc, e) => acc + e.progress_percentage,
            0
          ) / dashboard.enrollments.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#111827] to-[#1f1b2e] text-white px-4 py-10">
      {loading && <p className="mb-6 text-white/70">Loading dashboard...</p>}

      {/* Subtle Glow */}
      <div className="absolute w-80 h-80 bg-purple-500/10 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative mx-auto max-w-6xl">

        {/* Header */}
        <h1 className="text-3xl font-semibold mb-8 tracking-wide">
          Dashboard
        </h1>

        {(workspace?.unread_notifications ?? 0) > 0 && (
          <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm flex justify-between items-center gap-4">
            <span>
              You have {workspace.unread_notifications} unread inbox{" "}
              <Link className="text-amber-200 underline font-medium" to="/dashboard/notifications">
                notifications
              </Link>
            </span>
            <Link
              to="/dashboard/messages"
              className="shrink-0 rounded bg-white/10 px-3 py-1.5 hover:bg-white/20"
            >
              Messages
            </Link>
          </div>
        )}

        {workspace?.announcements?.length > 0 && (
          <div className="mb-10 rounded-xl border border-cyan-500/30 bg-white/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-300 mb-3">
              Latest announcements
            </h2>
            <ul className="space-y-2 text-sm text-white/70">
              {workspace.announcements.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <span className="text-white font-medium">{a.title}</span>
                  <p className="text-xs text-white/50 line-clamp-2">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
            <p className="text-sm text-white/50">
              Courses Enrolled
            </p>
            <h2 className="text-2xl font-semibold mt-2">
              {dashboard.enrollments.length}
            </h2>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
            <p className="text-sm text-white/50">
              Lessons Completed
            </p>
            <h2 className="text-2xl font-semibold mt-2">
              {dashboard.recent_activity.length}
            </h2>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">
            <p className="text-sm text-white/50">
              Average Progress
            </p>
            <h2 className="text-2xl font-semibold mt-2 text-purple-400">
              {avgProgress}%
            </h2>
          </div>

        </div>

        {/* Main */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Continue Learning */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">

            <h2 className="text-lg font-semibold mb-5 text-purple-300">
              Continue Learning
            </h2>

            <div className="space-y-4">

              {dashboard.enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-purple-400/30 transition"
                >
                  <p className="text-sm font-medium mb-2">
                    {enrollment.course_title}
                  </p>

                  <ProgressBar value={enrollment.progress_percentage} />

                  <div className="flex justify-between text-xs text-white/40 mt-1">
                    <span>Progress</span>
                    <span className="text-purple-300">
                      {enrollment.progress_percentage}%
                    </span>
                  </div>
                </div>
              ))}

            </div>

            {dashboard.enrollments.length === 0 && (
              <p className="text-white/40 text-sm">
                No enrolled courses yet.
              </p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10">

            <h2 className="text-lg font-semibold mb-5 text-orange-300">
              Upcoming work
            </h2>

            {(workspace?.upcoming_assignments || []).filter((a) => !a.submitted).length > 0 ? (
              <ul className="space-y-2 text-sm mb-6">
                {workspace.upcoming_assignments
                  .filter((a) => !a.submitted)
                  .slice(0, 5)
                  .map((a) => (
                    <li key={a.id}>
                      <Link to="/dashboard/assignments" className="text-orange-100 hover:text-white">
                        {a.title}{" "}
                        <span className="text-white/35"> · {a.course_title}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            ) : null}

            <h2 className="text-lg font-semibold mb-5 text-indigo-300">
              Recent Activity
            </h2>

            <ul className="space-y-3 text-sm text-white/60">

              {dashboard.recent_activity.map((item) => (
                <li
                  key={item.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-indigo-400/30 transition"
                >
                  Completed lesson #{item.lesson}
                </li>
              ))}

            </ul>

            {dashboard.recent_activity.length === 0 && (
              <p className="text-white/40 text-sm">
                No activity yet.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;