import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

/** Simple agenda view built from assignments with due dates. */
const StudentCalendarPage = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/learning/workspace/student/"),
      api.get("/learning/assignments/"),
    ])
      .then(([ws, asn]) => {
        const assignments = asn.data.results || asn.data || [];
        const upcoming = assignments
          .filter((a) => a.due_at)
          .map((a) => ({
            title: a.title,
            course: a.course_title,
            when: new Date(a.due_at),
          }))
          .sort((a, b) => a.when - b.when);
        setRows(upcoming);
        if (!(ws?.data?.upcoming_assignments || []).length && !upcoming.length) {
          return;
        }
      })
      .catch(() => toast.error("Calendar data failed"));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Schedule</h1>
      <p className="text-sm text-white/50">Upcoming assignment deadlines</p>
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={`${r.title}_${i}`} className="rounded-lg border border-white/10 p-3 flex justify-between">
            <span>
              <span className="font-medium text-cyan-200">{r.title}</span>
              <span className="text-xs text-white/40"> · {r.course}</span>
            </span>
            <span className="text-sm text-white/70">{r.when.toLocaleString()}</span>
          </li>
        ))}
      </ul>
      {!rows.length && (
        <p className="text-white/40 text-sm">Nothing scheduled yet — explore your courses!</p>
      )}
    </div>
  );
};

export default StudentCalendarPage;
