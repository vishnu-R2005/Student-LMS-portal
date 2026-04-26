import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const InstructorDashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    total_courses: 0,
    total_students: 0,
    courses: [],
  });

  useEffect(() => {
    api.get("/courses/instructor_dashboard/")
      .then(({ data }) => setData(data))
      .catch(console.error);
  }, []);

  if (!user || (user.role !== "instructor" && user.role !== "admin")) {
    return <p className="text-white p-10">Access Denied</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#111827] to-[#1f1b2e] text-white px-4 py-10">

      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <h1 className="text-3xl font-semibold mb-8">
          Instructor Dashboard
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-white/50 text-sm">Total Courses</p>
            <h2 className="text-2xl mt-2">{data.total_courses}</h2>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-white/50 text-sm">Total Students</p>
            <h2 className="text-2xl mt-2">{data.total_students}</h2>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-white/50 text-sm">Quick Action</p>
            <Link
              to="/instructor/panel"
              className="inline-block mt-2 text-cyan-400 hover:underline"
            >
              + Create Course
            </Link>
          </div>

        </div>

        {/* Course List */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">

          <h2 className="text-lg mb-4 text-purple-300">
            Your Courses
          </h2>

          <div className="space-y-4">
            {data.courses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-lg bg-white/5 border border-white/5"
              >
                <p className="font-medium">{course.title}</p>

                <div className="flex justify-between text-sm text-white/50 mt-2">
                  <span>{course.students} students</span>
                  <span className="text-indigo-400">{course.status}</span>
                </div>
              </div>
            ))}
          </div>

          {data.courses.length === 0 && (
            <p className="text-white/40">No courses created yet.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default InstructorDashboardPage;