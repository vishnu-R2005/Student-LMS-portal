import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AdminCategoriesPage = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const load = () =>
    api.get("/learning/categories/").then(({ data }) => setItems(data.results || data));

  useEffect(() => {
    load().catch(() => toast.error("Categories unavailable"));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post("/learning/categories/", {
        name: name.trim(),
        description: desc.trim(),
        slug: "",
      });
      setName("");
      setDesc("");
      toast.success("Category created");
      load();
    } catch {
      toast.error("Slug is auto-filled from name server-side.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Course categories</h1>

      <form onSubmit={create} className="max-w-md space-y-3 rounded-xl border border-white/10 p-4">
        <input
          className="w-full rounded bg-black/40 p-2 text-sm"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="w-full rounded bg-black/40 p-2 text-sm min-h-[60px]"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className="rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-black">Add</button>
      </form>

      <ul className="space-y-2 text-sm">
        {items.map((c) => (
          <li key={c.id} className="rounded border border-white/10 p-3">
            <span className="text-cyan-200">{c.name}</span>
            <span className="text-white/35"> · /{c.slug}</span>
            {c.description && <p className="text-xs text-white/50 mt-1">{c.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategoriesPage;
