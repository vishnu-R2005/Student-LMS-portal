import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

const ProfilePage = ({ title }) => {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
    });
  }, [user]);
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
  });

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.patch("/auth/profile/", form);
      await refresh?.();
      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const changePw = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/change_password/", passwords);
      setPasswords({ old_password: "", new_password: "" });
      toast.success("Password updated");
    } catch {
      toast.error("Password change failed");
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <h1 className="text-2xl font-semibold">{title || "Your profile"}</h1>

      <form className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-6" onSubmit={saveProfile}>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Profile</p>
        {(["first_name", "last_name", "email"] ).map((f) => (
          <label key={f} className="block text-xs text-white/50">
            {f.replace("_", " ")}
            <input
              className="mt-1 w-full rounded bg-black/40 p-2 text-sm capitalize"
              value={form[f]}
              onChange={(e) => setForm({ ...form, [f]: e.target.value })}
            />
          </label>
        ))}
        <label className="block text-xs text-white/50">
          Avatar URL
          <input
            className="mt-1 w-full rounded bg-black/40 p-2 text-sm"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          />
        </label>
        <label className="block text-xs text-white/50">
          Bio
          <textarea
            className="mt-1 w-full rounded bg-black/40 p-2 text-sm min-h-[80px]"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </label>
        <button className="rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-black">Save profile</button>
      </form>

      <form className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-6" onSubmit={changePw}>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Change password</p>
        <input
          type="password"
          className="w-full rounded bg-black/40 p-2 text-sm"
          placeholder="Current password"
          value={passwords.old_password}
          onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
        />
        <input
          type="password"
          className="w-full rounded bg-black/40 p-2 text-sm"
          placeholder="New password"
          minLength={8}
          value={passwords.new_password}
          onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
        />
        <button className="rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-black">
          Update password
        </button>
      </form>
      <div className="text-xs text-white/40 space-y-1">
        <p>Username (read-only): {user?.username}</p>
        <p>Role: {user?.role}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
