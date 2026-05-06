import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const InstructorAssignmentsPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course: "",
    title: "",
    description: "",
    due_at: "",
    max_points: "100",
  });
  const [quizForm, setQuizForm] = useState({
    course: "",
    title: "",
    pass_score_percent: "60",
    questions_json: `[
  {"question": "Sample?", "choices": ["A","B","C"], "correct_index": 0}
]`,
  });

  useEffect(() => {
    api
      .get("/courses/my_courses/")
      .then(({ data }) => setCourses(data))
      .catch(() => toast.error("Courses failed"));
  }, []);

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post("/learning/assignments/", {
        course: Number(form.course),
        title: form.title,
        description: form.description,
        due_at: form.due_at || null,
        max_points: form.max_points,
      });
      toast.success("Assignment created");
    } catch {
      toast.error("Failed");
    }
  };

  const createQuiz = async (e) => {
    e.preventDefault();
    try {
      const questions = JSON.parse(quizForm.questions_json);
      await api.post("/learning/quizzes/", {
        course: Number(quizForm.course),
        title: quizForm.title,
        pass_score_percent: Number(quizForm.pass_score_percent),
        questions,
      });
      toast.success("Quiz created");
    } catch {
      toast.error("Invalid JSON or request");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-cyan-200">New assignment</h2>
        <form className="mt-4 space-y-3 text-sm" onSubmit={createAssignment}>
          <select
            className="w-full rounded bg-black/40 p-2"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            required
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded bg-black/40 p-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="w-full rounded bg-black/40 p-2 min-h-[80px]"
            placeholder="Instructions"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="datetime-local"
            className="w-full rounded bg-black/40 p-2"
            value={form.due_at}
            onChange={(e) => setForm({ ...form, due_at: e.target.value })}
          />
          <input
            className="w-full rounded bg-black/40 p-2"
            placeholder="Max points"
            value={form.max_points}
            onChange={(e) => setForm({ ...form, max_points: e.target.value })}
          />
          <button className="w-full rounded bg-cyan-500 py-2 font-semibold text-black">Publish</button>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-purple-200">New quiz (JSON questions)</h2>
        <form className="mt-4 space-y-3 text-sm" onSubmit={createQuiz}>
          <select
            className="w-full rounded bg-black/40 p-2"
            value={quizForm.course}
            onChange={(e) => setQuizForm({ ...quizForm, course: e.target.value })}
            required
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <input
            className="w-full rounded bg-black/40 p-2"
            placeholder="Quiz title"
            value={quizForm.title}
            onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
          />
          <input
            className="w-full rounded bg-black/40 p-2"
            placeholder="Pass %"
            value={quizForm.pass_score_percent}
            onChange={(e) => setQuizForm({ ...quizForm, pass_score_percent: e.target.value })}
          />
          <textarea
            className="w-full rounded bg-black/40 p-2 font-mono text-xs min-h-[160px]"
            value={quizForm.questions_json}
            onChange={(e) => setQuizForm({ ...quizForm, questions_json: e.target.value })}
          />
          <button className="w-full rounded bg-purple-500 py-2 font-semibold text-white">Create quiz</button>
        </form>
      </section>
    </div>
  );
};

export default InstructorAssignmentsPage;
