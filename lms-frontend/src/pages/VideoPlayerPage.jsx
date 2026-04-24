import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const VideoPlayerPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [enrollmentId, setEnrollmentId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const DEFAULT_VIDEO = "https://www.youtube.com/embed/bMknfKXIFA8";

  useEffect(() => {
    api.get(`/courses/${courseId}/`)
      .then(({ data }) => {
        setCourse(data);
        const first = data.modules?.[0]?.lessons?.[0];
        if (first) setSelectedLesson(first);
      })
      .catch(() => setCourse(null));

    api.get("/enrollments/", { params: { course: courseId } })
      .then(({ data }) => {
        const rows = data.results || data;
        setEnrollmentId(rows?.[0]?.id || null);
      })
      .catch(() => setEnrollmentId(null));
  }, [courseId]);

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a12] text-white">
        Loading lesson player...
      </div>
    );
  }

  const lessons = course.modules?.flatMap((m) => m.lessons) || [];

  const currentIndex = lessons.findIndex(
    (l) => l.id === selectedLesson?.id
  );

  const videoUrl = selectedLesson?.video_url || DEFAULT_VIDEO;

  const isYouTube =
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be");

  const handleVideoEnd = () => {
    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      setSelectedLesson(nextLesson);
      toast.success("Next lesson ▶️");
    }
  };

  const markComplete = async () => {
    try {
      await api.post("/progress/mark_complete/", {
        enrollment: enrollmentId,
        lesson: selectedLesson.id,
      });
      toast.success("Completed ✅");
    } catch {
      toast.error("Error updating progress");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a12] via-[#111827] to-[#1f1b2e] text-white px-4 py-6">

      {/* Glow Effects */}
      <div className="absolute w-80 h-80 bg-purple-500/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="relative mx-auto max-w-6xl">

        {/* Title */}
        <h1 className="mb-6 text-3xl font-bold tracking-wide">
          {course.title}
        </h1>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* VIDEO */}
          <div className="lg:col-span-2 space-y-4">

            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.2)]">

              {isYouTube ? (
                <iframe
                  key={videoUrl}
                  src={videoUrl}
                  className="h-[500px] w-full"
                  title="Video Player"
                  allowFullScreen
                />
              ) : (
                <video
                  key={videoUrl}
                  controls
                  onEnded={handleVideoEnd}
                  className="h-[500px] w-full bg-black"
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              )}
            </div>

            {/* Lesson Info */}
            <div className="bg-white/5 p-5 rounded-xl border border-white/10 backdrop-blur-lg">
              
              <h2 className="text-lg font-semibold">
                {selectedLesson?.title}
              </h2>

              <button
                onClick={markComplete}
                className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition shadow-lg"
              >
                ✅ Mark Complete
              </button>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">

            <h3 className="font-semibold mb-4 text-purple-300">
              📚 Course Content
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">

              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-3 rounded-lg cursor-pointer transition flex justify-between items-center ${
                    selectedLesson?.id === lesson.id
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-sm">
                    {index + 1}. {lesson.title}
                  </span>

                  {selectedLesson?.id === lesson.id && <span>▶</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;