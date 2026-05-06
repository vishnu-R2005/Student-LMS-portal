import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const MessagesPage = () => {
  const [partnerId, setPartnerId] = useState("");
  const [partners, setPartners] = useState([]);
  const [msgs, setMsgs] = useState([]);
  const [body, setBody] = useState("");

  const loadPartners = () =>
    api
      .get("/learning/messages/partners/")
      .then(({ data }) => setPartners(data.partner_ids || []))
      .catch(() => {});

  const loadThread = async (pid) => {
    try {
      const { data } = await api.get("/learning/messages/", { params: { partner: pid } });
      setMsgs(data.results ? data.results : Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load conversation");
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    if (partnerId) loadThread(partnerId);
  }, [partnerId]);

  const send = async (e) => {
    e.preventDefault();
    if (!partnerId) {
      toast.error("Pick a partner user ID");
      return;
    }
    try {
      await api.post("/learning/messages/", {
        recipient: Number(partnerId),
        body: body.trim(),
      });
      setBody("");
      loadThread(partnerId);
      toast.success("Sent");
    } catch {
      toast.error("Messaging not allowed or failed");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-4">
      <div className="lg:col-span-1 rounded-xl border border-white/10 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-white/40">Partners</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {partners.map((pid) => (
            <li key={pid}>
              <button
                type="button"
                onClick={() => setPartnerId(String(pid))}
                className={`w-full rounded px-2 py-1 text-left ${String(pid) === partnerId ? "bg-cyan-500/25" : "hover:bg-white/10"}`}
              >
                User #{pid}
              </button>
            </li>
          ))}
        </ul>
        {!partners.length && (
          <p className="text-xs text-white/40 mt-2">No threads yet.</p>
        )}
        <div className="mt-6">
          <p className="text-xs text-white/50 mb-2">Manual user id</p>
          <input
            className="w-full rounded bg-black/40 p-2 text-sm"
            placeholder="Recipient user id"
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
          />
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur min-h-[400px]">
        <div className="flex-1 space-y-3 overflow-auto">
          {(Array.isArray(msgs) ? msgs : []).map((m) => (
            <div
              key={m.id}
              className="rounded-lg border border-white/5 bg-black/40 p-3 text-sm"
            >
              <span className="text-xs text-cyan-300">{m.sender_name}</span>: {m.body}
            </div>
          ))}
        </div>

        <form onSubmit={send} className="mt-4 flex gap-2">
          <textarea
            className="flex-1 rounded bg-black/50 p-2 text-sm"
            placeholder="Message…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button className="rounded bg-cyan-500 px-4 font-semibold text-black">Send</button>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
