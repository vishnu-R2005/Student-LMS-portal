import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const InstructorCertificatesPage = () => {
  const [courses, setCourses] = useState([]);
  const [issued, setIssued] = useState([]);
  const [form, setForm] = useState({ student: "", course: "" });

  useEffect(() => {
    api.get("/courses/my_courses/").then(({ data }) => setCourses(data)).catch(() => {});
    api
      .get("/learning/certificates/")
      .then(({ data }) => setIssued(data.results || data))
      .catch(() => {});
  }, []);

  const issue = async (e) => {
    e.preventDefault();
    try {
      await api.post("/learning/certificates/issue/", {
        student: Number(form.student),
        course: Number(form.course),
      });
      toast.success("Issued certificate");
      const { data } = await api.get("/learning/certificates/");
      setIssued(data.results || data);
    } catch {
      toast.error("Issue failed — enroll student first");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Certificates</h1>
      <form className="max-w-md space-y-3 rounded-xl border border-white/10 bg-white/5 p-5 text-sm" onSubmit={issue}>
        <select
          className="w-full rounded bg-black/40 p-2"
          value={form.course}
          required
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
        <button className="w-full rounded bg-emerald-500 py-2 font-semibold text-black">Issue credential</button>
      </form>
      <ul className="text-xs font-mono text-white/60 space-y-1">
        {issued.map((c) => (
          <li key={c.id}>
            {c.course_title} · student {c.student} · {c.verification_code}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InstructorCertificatesPage;
