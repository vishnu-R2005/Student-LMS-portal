import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    api
      .get(`/learning/quizzes/${quizId}/`)
      .then(({ data }) => {
        setQuiz(data);
        setAnswers(Array((data.questions || []).length).fill(0));
      })
      .catch(() => toast.error("Could not load quiz"));
  }, [quizId]);

  const choose = (qIndex, choiceIndex) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex] = choiceIndex;
      return copy;
    });
  };

  const submit = async () => {
    try {
      const { data } = await api.post("/learning/quiz-attempts/", {
        quiz: Number(quizId),
        answers,
      });
      toast.success(`Score ${data.score_percent}% — ${data.passed ? "passed" : "below pass line"}`);
      navigate("/dashboard/quizzes");
    } catch {
      toast.error("Submission failed");
    }
  };

  if (!quiz) return <p className="text-white/60">Loading…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">{quiz.title}</h1>
      <p className="text-sm text-white/50">Pass score: {quiz.pass_score_percent}%</p>

      {(quiz.questions || []).map((q, qi) => (
        <fieldset key={qi} className="rounded-xl border border-white/10 bg-white/5 p-4">
          <legend className="text-sm font-medium text-cyan-200">
            Question {qi + 1}
          </legend>
          <p className="mt-2 text-white/90">{q.question}</p>
          <div className="mt-3 space-y-2">
            {(q.choices || []).map((choice, ci) => (
              <label key={ci} className="flex cursor-pointer gap-2 text-sm">
                <input
                  type="radio"
                  name={`q_${qi}`}
                  checked={answers[qi] === ci}
                  onChange={() => choose(qi, ci)}
                />
                {choice}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={submit}
        className="rounded bg-emerald-500 px-6 py-2 font-semibold text-black hover:bg-emerald-400"
      >
        Submit answers
      </button>
    </div>
  );
};

export default QuizTakePage;
