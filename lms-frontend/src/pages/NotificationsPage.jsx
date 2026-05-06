import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const NotificationsPage = () => {
  const [items, setItems] = useState([]);

  const load = () =>
    api
      .get("/learning/notifications/")
      .then(({ data }) => setItems(data.results || data))
      .catch(() => toast.error("Could not load notifications"));

  useEffect(() => {
    load();
  }, []);

  const mark = async (id) => {
    try {
      await api.post(`/learning/notifications/${id}/mark_read/`);
      load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <ul className="space-y-2">
        {items.map((n) => (
          <li
            key={n.id}
            className={`flex justify-between gap-4 rounded-lg border border-white/10 p-4 ${n.read ? "opacity-60" : ""}`}
          >
            <div>
              <p className="font-medium text-cyan-200">{n.title}</p>
              <p className="text-sm text-white/60">{n.body}</p>
            </div>
            {!n.read && (
              <button
                type="button"
                onClick={() => mark(n.id)}
                className="h-fit rounded bg-white/10 px-3 py-1 text-xs hover:bg-white/20"
              >
                Mark read
              </button>
            )}
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="text-white/40 text-sm">You are all caught up.</p>}
    </div>
  );
};

export default NotificationsPage;
