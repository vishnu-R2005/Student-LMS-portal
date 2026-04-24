import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const InstructorPanelPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    price: 0,
  });

  const load = () =>
    api.get("/courses/my_courses/").then(({ data }) => setCourses(data));

  useEffect(() => {
    load();
  }, []);

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post("/courses/", form);
      toast.success("Course submitted for approval 🚀");
      setForm({
        title: "",
        description: "",
        category: "General",
        price: 0,
      });
      load();
    } catch {
      toast.error("Failed to create course");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-4 py-10">
      
      {/* Glow Effects */}
      <div className="absolute w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative mx-auto max-w-6xl">
        
        {/* Header */}
        <h1 className="text-4xl font-bold mb-8">
          Instructor Studio 🎓
        </h1>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
            <p className="text-white/60 text-sm">Total Courses</p>
            <h2 className="text-3xl font-bold mt-2">
              {courses.length}
            </h2>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
            <p className="text-white/60 text-sm">Published</p>
            <h2 className="text-3xl font-bold mt-2">
              {courses.filter((c) => c.status === "approved").length}
            </h2>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
            <p className="text-white/60 text-sm">Pending</p>
            <h2 className="text-3xl font-bold mt-2">
              {courses.filter((c) => c.status !== "approved").length}
            </h2>
          </div>
        </div>

        {/* Create Course Form */}
        <form
          onSubmit={createCourse}
          className="bg-white/5 mb-10 grid gap-4 rounded-2xl p-6 border border-white/10 backdrop-blur-lg md:grid-cols-2"
        >
          <input
            className="rounded-lg bg-white/10 p-3 outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Course title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            className="rounded-lg bg-white/10 p-3 outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <textarea
            className="rounded-lg bg-white/10 p-3 md:col-span-2 outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            type="number"
            className="rounded-lg bg-white/10 p-3 outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          <button className="rounded-lg bg-cyan-400 text-black font-semibold p-3 hover:bg-cyan-300 transition hover:shadow-[0_0_10px_#22d3ee]">
            Create Course
          </button>
        </form>

        {/* Course List */}
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition"
            >
              <h3 className="font-semibold text-lg">
                {course.title}
              </h3>

              <p
                className={`text-sm mt-2 ${
                  course.status === "approved"
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {course.status}
              </p>
            </div>
          ))}

          {courses.length === 0 && (
            <p className="text-white/60">
              No courses created yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorPanelPage;