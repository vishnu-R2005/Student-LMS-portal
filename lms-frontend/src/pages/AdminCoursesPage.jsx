import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);

  const load = () =>
    api
      .get("/courses/", { params: { ordering: "-created_at" } })
      .then(({ data }) => setCourses(data.results || data));

  useEffect(() => {
    load().catch(() => toast.error("Courses failed"));
  }, []);

  const act = async (id, endpoint) => {
    try {
      await api.post(`/courses/${id}/${endpoint}/`);
      toast.success("Updated");
      load();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Course moderation</h1>
      <p className="text-sm text-white/50">Approve or reject pending instructor submissions.</p>
      <ul className="space-y-2">
        {courses.map((c) => (
          <li key={c.id} className="rounded-lg border border-white/10 p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <p className="font-medium text-cyan-200">{c.title}</p>
              <p className="text-xs text-white/45">
                {c.instructor_name} ·{" "}
                <span className="uppercase text-amber-300/90">{c.status}</span>
              </p>
            </div>
            {c.status === "pending" && (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded bg-emerald-500 px-3 py-1 text-xs font-semibold text-black"
                  onClick={() => act(c.id, "approve")}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="rounded bg-rose-500 px-3 py-1 text-xs font-semibold"
                  onClick={() => act(c.id, "reject")}
                >
                  Reject
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCoursesPage;
