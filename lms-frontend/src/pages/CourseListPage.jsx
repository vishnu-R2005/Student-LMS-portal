import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import api from "../services/api";

const categories = ["All", "Development", "AI", "Business", "Design"];

const CourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    setLoading(true);
    const { data } = await api.get("/courses/", {
      params: {
        search,
        category: category === "All" ? "" : category,
      },
    });
    setCourses(data.results || data);
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#111827] to-[#1f1b2e] text-white px-4 py-10">
      
      {/* Glow Effects */}
      <div className="absolute w-80 h-80 bg-purple-500/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative mx-auto max-w-6xl">
        
        {/* Header */}
        <h1 className="text-4xl font-bold mb-8 tracking-wide">
          Explore Courses 🚀
        </h1>

        {/* Search + Filter */}
        <div className="mb-10 space-y-5">
          
          {/* 🔍 Search Bar */}
          <input
            className="w-full rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 px-5 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_10px_rgba(139,92,246,0.5)] transition"
            placeholder="🔍 Search for courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* 🎯 Category Chips */}
          <div className="flex flex-wrap gap-3 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  category === cat
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Apply Button */}
            <button
              onClick={loadCourses}
              className="ml-auto px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* 📦 Courses Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))
            : courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
        </div>

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center mt-12 text-white/60 text-lg">
            No courses found 😕
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListPage;