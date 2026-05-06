import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const ForumPage = () => {
  const [params] = useSearchParams();
  const initialCourse = params.get("course") || "";
  const { user } = useAuth();
  const [course, setCourse] = useState(initialCourse);
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const load = () => {
    const q = {};
    if (course) q.course = course;
    api
      .get("/learning/forum/threads/", { params: q })
      .then(({ data }) => setThreads(data.results || data))
      .catch(() => toast.error("Could not load forum"));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  const createThread = async (e) => {
    e.preventDefault();
    if (!course) {
      toast.error("Set a course id (from URL query ?course=ID)");
      return;
    }
    try {
      await api.post("/learning/forum/threads/", {
        course: Number(course),
        title,
        body,
      });
      setTitle("");
      setBody("");
      toast.success("Thread created");
      load();
    } catch {
      toast.error("Could not create thread");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Discussion forum</h1>
        <p className="text-sm text-white/50 mt-2">
          Filter by course ID (copy from catalog URL). Append{" "}
          <code className="text-cyan-300">?course=ID</code> to this page.
        </p>
        <label className="mt-4 block max-w-xs text-xs text-white/50">
          Course ID
          <input
            className="mt-1 w-full rounded bg-black/40 p-2 text-sm text-white"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </label>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <p className="text-sm font-medium text-cyan-200 mb-3">New thread</p>
        <form className="space-y-3" onSubmit={createThread}>
          <input
            className="w-full rounded bg-black/40 p-2 text-sm"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full rounded bg-black/40 p-2 text-sm min-h-[80px]"
            placeholder="Discussion…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            type="submit"
            className="rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-black"
          >
            Post
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg text-white/80">Threads</h2>
        {threads.map((t) => (
          <div key={t.id} className="rounded-lg border border-white/10 p-4">
            <p className="font-medium text-purple-300">{t.title}</p>
            <p className="text-xs text-white/40">by {t.author_name}</p>
            <p className="mt-2 text-sm text-white/70">{t.body}</p>

            {(t.replies || []).slice(0, 3).map((r) => (
              <div key={r.id} className="mt-3 ml-3 border-l border-white/10 pl-3 text-xs text-white/60">
                <span className="text-cyan-300">{r.author_name}</span>: {r.body}
              </div>
            ))}

            <ReplyComposer thread={t.id} reload={load} username={user?.username} />
          </div>
        ))}
      </section>
      {threads.length === 0 && <p className="text-white/40 text-sm">No threads.</p>}
    </div>
  );
};

function ReplyComposer({ thread, reload, username }) {
  const [reply, setReply] = useState("");
  const send = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      await api.post("/learning/forum/replies/", { thread, body: reply.trim() });
      setReply("");
      reload();
      toast.success("Posted");
    } catch {
      toast.error("Reply failed");
    }
  };

  return (
    <form onSubmit={send} className="mt-3 flex flex-col gap-2">
      <input
        className="rounded bg-black/40 p-2 text-xs"
        placeholder={`Reply as ${username || "…"}`}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button
        type="submit"
        className="max-w-fit rounded bg-white/15 px-3 py-1 text-xs hover:bg-white/25"
      >
        Reply
      </button>
    </form>
  );
}

export default ForumPage;
