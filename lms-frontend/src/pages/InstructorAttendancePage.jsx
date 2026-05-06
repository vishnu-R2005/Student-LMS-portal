import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const InstructorAttendancePage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course: "",
    student: "",
    session_date: new Date().toISOString().slice(0, 10),
    present: true,
    notes: "",
  });

  useEffect(() => {
    api.get("/courses/my_courses/").then(({ data }) => setCourses(data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/learning/attendance/", {
        course: Number(form.course),
        student: Number(form.student),
        session_date: form.session_date,
        present: form.present,
        notes: form.notes,
      });
      toast.success("Attendance saved");
    } catch {
      toast.error("Needs valid student enrollment on that course");
    }
  };

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Attendance</h1>
      <form className="space-y-3 text-sm rounded-xl border border-white/10 p-5 bg-white/5" onSubmit={submit}>
        <select
          className="w-full rounded bg-black/40 p-2"
          required
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        >
          <option value="">Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <input
          placeholder="Student user ID"
          className="w-full rounded bg-black/40 p-2"
          required
          value={form.student}
          onChange={(e) => setForm({ ...form, student: e.target.value })}
        />
        <input
          type="date"
          className="w-full rounded bg-black/40 p-2"
          value={form.session_date}
          onChange={(e) => setForm({ ...form, session_date: e.target.value })}
        />
        <label className="flex gap-2 text-xs items-center">
          <input
            type="checkbox"
            checked={form.present}
            onChange={(e) => setForm({ ...form, present: e.target.checked })}
          />
          Present
        </label>
        <input
          placeholder="Notes"
          className="w-full rounded bg-black/40 p-2"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button className="w-full rounded bg-cyan-500 py-2 font-semibold text-black">Save row</button>
      </form>
      <p className="text-xs text-white/40">
        Duplicate date + student combinations update via admin or future bulk tool.
      </p>
    </div>
  );
};

export default InstructorAttendancePage;