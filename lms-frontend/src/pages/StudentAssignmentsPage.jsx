import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const StudentAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [draft, setDraft] = useState({});

  useEffect(() => {
    api
      .get("/learning/assignments/")
      .then(({ data }) => setAssignments(data.results || data))
      .catch(() => toast.error("Failed to load assignments"));
  }, []);

  const submit = async (a) => {
    const content = draft[a.id]?.content || "";
    const attachment_url = draft[a.id]?.attachment_url || "";
    try {
      await api.post("/learning/assignment-submissions/", {
        assignment: a.id,
        content,
        attachment_url,
      });
      toast.success("Submitted");
    } catch {
      toast.error("Submission failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Assignments</h1>
      <div className="space-y-4">
        {assignments.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
          >
            <p className="font-medium text-cyan-200">{a.title}</p>
            <p className="text-xs text-white/50">{a.course_title}</p>
            <p className="mt-2 text-sm text-white/70">{a.description}</p>
            {a.due_at && (
              <p className="mt-1 text-xs text-amber-300/80">Due {new Date(a.due_at).toLocaleString()}</p>
            )}
            <textarea
              placeholder="Your answer…"
              className="mt-3 w-full rounded bg-black/40 p-2 text-sm outline-none ring-cyan-500/30 focus:ring"
              value={draft[a.id]?.content || ""}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  [a.id]: { ...(prev[a.id] || {}), content: e.target.value },
                }))
              }
            />
            <input
              placeholder="Attachment URL (optional)"
              className="mt-2 w-full rounded bg-black/40 p-2 text-sm outline-none"
              value={draft[a.id]?.attachment_url || ""}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  [a.id]: { ...(prev[a.id] || {}), attachment_url: e.target.value },
                }))
              }
            />
            <button
              type="button"
              onClick={() => submit(a)}
              className="mt-3 rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400"
            >
              Submit / update
            </button>
          </div>
        ))}
      </div>
      {assignments.length === 0 && (
        <p className="text-white/40 text-sm">No assignments for your enrollments.</p>
      )}
    </div>
  );
};

export default StudentAssignmentsPage;
