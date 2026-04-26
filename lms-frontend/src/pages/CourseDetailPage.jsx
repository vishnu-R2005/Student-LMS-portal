import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get(`/courses/${id}/`);
      setCourse(data);
      setFailed(false);
      try {
        const res = await api.get("/enrollments/", {
          params: { course: id },
        });
        const rows = res.data.results || res.data;
        setIsEnrolled(rows.length > 0);
      } catch {
        setIsEnrolled(false);
      }
    } catch {
      setCourse(null);
      setFailed(true);
      toast.error("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const enroll = async () => {
    try {
      await api.post("/enrollments/", { course: id });
      toast.success("Enrolled successfully 🚀");
      setIsEnrolled(true);
    } catch {
      toast.error("Enrollment failed");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-white">
        Loading course...
      </div>
    );
  }

  if (failed || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-white">
        Course not available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-4 py-10">
      
      {/* Glow Effects */}
      <div className="absolute w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full top-20 left-10"></div>
      <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative mx-auto max-w-6xl">
        
        {/* 🔥 HERO (FULL IMAGE COVER) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          
          {/* Background Image */}
          <img
            src={course.thumbnail || "https://picsum.photos/1200/500"}
            alt={course.title}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          {/* Content */}
          <div className="relative p-10 h-72 flex flex-col justify-end">
            
            <h1 className="text-4xl font-bold">
              {course.title}
            </h1>

            <p className="mt-3 max-w-2xl text-white/80">
              {course.description}
            </p>

            {/* CTA */}
            <div className="mt-6 flex gap-4 flex-wrap">
              {!isEnrolled ? (
                <button
                  onClick={enroll}
                  className="px-6 py-3 rounded-lg bg-cyan-400 text-black font-semibold hover:bg-cyan-300 transition"
                >
                  🚀 Enroll Now
                </button>
              ) : (
                <Link
                  to={`/learn/${id}`}
                  className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition"
                >
                  ▶ Continue Learning
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 📊 INFO SECTION */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
            <h3 className="font-semibold text-lg">📚 Lessons</h3>
            <p className="text-white/60 mt-2">
              {course.modules?.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              ) || 0} lessons
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
            <h3 className="font-semibold text-lg">📂 Category</h3>
            <p className="text-white/60 mt-2">
              {course.category || "General"}
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
            <h3 className="font-semibold text-lg">🏆 Certificate</h3>
            <p className="text-white/60 mt-2">
              Earn after completion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;