import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const StudentQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    api
      .get("/learning/quizzes/")
      .then(({ data }) => setQuizzes(data.results || data))
      .catch(() => toast.error("Could not load quizzes"));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quizzes</h1>
      <ul className="space-y-2">
        {quizzes.map((q) => (
          <li key={q.id}>
            <Link
              className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:border-cyan-400/40"
              to={`/dashboard/quizzes/${q.id}`}
            >
              {q.title}{" "}
              <span className="text-xs text-white/40"> · {q.course_title}</span>
            </Link>
          </li>
        ))}
      </ul>
      {quizzes.length === 0 && <p className="text-white/40 text-sm">No quizzes posted yet.</p>}
    </div>
  );
};

export default StudentQuizzesPage;
