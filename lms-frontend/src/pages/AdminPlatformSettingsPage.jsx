import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AdminPlatformSettingsPage = () => {
  const [rows, setRows] = useState([]);
  const [key, setKey] = useState("");
  const [value, setValue] = useState("{}");

  useEffect(() => {
    api
      .get("/learning/platform-settings/")
      .then(({ data }) => setRows(data.results || data))
      .catch(() => {});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(value);
      await api.post("/learning/platform-settings/", { key: key.trim(), value: parsed });
      toast.success("Saved");
      const { data } = await api.get("/learning/platform-settings/");
      setRows(data.results || data);
    } catch {
      toast.error("Valid JSON value required");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Platform settings</h1>
      <p className="text-sm text-white/50">
        Store feature flags and copy as JSON blobs. Example keys:{" "}
        <code className="text-cyan-300">maintenance_mode</code>,{" "}
        <code className="text-cyan-300">site_name</code>.
      </p>
      <form onSubmit={save} className="max-w-xl space-y-2">
        <input
          className="w-full rounded bg-black/40 p-2 text-sm"
          placeholder="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <textarea
          className="w-full rounded bg-black/40 p-2 font-mono text-xs min-h-[100px]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="rounded bg-cyan-500 px-4 py-2 font-semibold text-black">Upsert setting</button>
      </form>
      <ul className="space-y-2 text-xs font-mono text-white/60">
        {rows.map((r) => (
          <li key={r.id}>
            <span className="text-cyan-300">{r.key}</span>: {JSON.stringify(r.value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPlatformSettingsPage;
