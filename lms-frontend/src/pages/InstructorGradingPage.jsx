import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const InstructorGradingPage = () => {
  const [subs, setSubs] = useState([]);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    api
      .get("/learning/assignment-submissions/")
      .then(({ data }) => setSubs(data.results || data))
      .catch(() => toast.error("Could not load submissions"));
  }, []);

  const grade = async (id) => {
    const score = grades[id]?.score;
    const feedback = grades[id]?.feedback || "";
    if (score === undefined || score === "") {
      toast.error("Enter score");
      return;
    }
    try {
      await api.patch(`/learning/assignment-submissions/${id}/grade/`, { score, feedback });
      toast.success("Graded");
      const { data } = await api.get("/learning/assignment-submissions/");
      setSubs(data.results || data);
    } catch {
      toast.error("Grade failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Grading queue</h1>
      <ul className="space-y-4 text-sm">
        {subs.map((s) => (
          <li key={s.id} className="rounded-xl border border-white/10 p-4">
            <p className="font-medium text-cyan-200">{s.assignment_title}</p>
            <p className="text-xs text-white/45">Student #{s.student}</p>
            <p className="mt-2 text-white/70 whitespace-pre-wrap">{s.content}</p>
            {s.attachment_url && (
              <a href={s.attachment_url} className="text-xs text-cyan-400 underline block mt-1">
                Attachment
              </a>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                type="number"
                placeholder="Score"
                className="w-24 rounded bg-black/40 p-2"
                value={grades[s.id]?.score ?? ""}
                onChange={(e) =>
                  setGrades((prev) => ({
                    ...prev,
                    [s.id]: { ...(prev[s.id] || {}), score: e.target.value },
                  }))
                }
              />
              <input
                placeholder="Feedback"
                className="flex-1 min-w-[120px] rounded bg-black/40 p-2"
                value={grades[s.id]?.feedback ?? ""}
                onChange={(e) =>
                  setGrades((prev) => ({
                    ...prev,
                    [s.id]: { ...(prev[s.id] || {}), feedback: e.target.value },
                  }))
                }
              />
              <button
                type="button"
                className="rounded bg-emerald-500 px-3 py-2 font-semibold text-black"
                onClick={() => grade(s.id)}
              >
                Publish grade
              </button>
            </div>
            {s.status === "graded" && (
              <p className="mt-2 text-xs text-emerald-300/80">
                Graded: {s.score} — {s.feedback}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorGradingPage;
