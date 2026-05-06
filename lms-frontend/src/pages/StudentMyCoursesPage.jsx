import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ProgressBar from "../components/ProgressBar";
import api from "../services/api";

const StudentMyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  useEffect(() => {
    api
      .get("/enrollments/dashboard/")
      .then(({ data }) => setEnrollments(data.enrollments || []))
      .catch(() => toast.error("Could not load courses"));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">My courses</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {enrollments.map((e) => (
          <div
            key={e.id}
            className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
          >
            <p className="font-medium text-cyan-200">{e.course_title}</p>
            <ProgressBar value={e.progress_percentage} />
            <div className="mt-4 flex gap-3 text-xs">
              <Link
                to={`/courses/${e.course}`}
                className="rounded bg-white/10 px-3 py-1.5 hover:bg-white/20"
              >
                Details
              </Link>
              <Link
                to={`/learn/${e.course}`}
                className="rounded bg-cyan-500 px-3 py-1.5 font-semibold text-black hover:bg-cyan-400"
              >
                Continue
              </Link>
            </div>
          </div>
        ))}
      </div>
      {enrollments.length === 0 && (
        <p className="text-white/50">You have not enrolled in any courses yet.</p>
      )}
    </div>
  );
};

export default StudentMyCoursesPage;
