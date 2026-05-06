import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api
      .get("/reports/")
      .then(({ data }) => setReports(data.results || data))
      .catch(() => toast.error("Could not load complaints"));
  }, []);

  const resolve = async (id) => {
    try {
      await api.patch(`/reports/${id}/`, { status: "resolved" });
      toast.success("Marked resolved");
      const { data } = await api.get("/reports/");
      setReports(data.results || data);
    } catch {
      toast.error("Patch failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Content reports</h1>
      <ul className="space-y-2 text-sm">
        {reports.map((r) => (
          <li key={r.id} className="rounded border border-white/10 p-4">
            <p className="text-white/60">Course #{r.course}</p>
            <p className="mt-1 text-white/80">{r.reason}</p>
            <p className="text-xs text-amber-300/80">{r.status}</p>
            {r.status !== "resolved" && (
              <button
                type="button"
                className="mt-2 rounded bg-white/15 px-3 py-1 text-xs"
                onClick={() => resolve(r.id)}
              >
                Resolve
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminReportsPage;
