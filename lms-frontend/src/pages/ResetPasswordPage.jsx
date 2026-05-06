import { useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const uid = useMemo(() => params.get("uid") || "", [params]);
  const token = useMemo(() => params.get("token") || "", [params]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!uid || !token) {
      toast.error("Invalid reset link.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/password_reset_confirm/", {
        uid,
        token,
        new_password: password,
      });
      toast.success("Password updated");
      navigate("/login");
    } catch {
      toast.error("Reset failed or link expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-xl p-8 space-y-6 text-white"
      >
        <h2 className="text-xl text-center">Set a new password</h2>
        <input
          type="password"
          required
          minLength={8}
          className="w-full rounded bg-white/10 p-3 outline-none ring-cyan-400 focus:ring"
          placeholder="New password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-cyan-400 py-3 font-semibold text-black disabled:opacity-50"
        >
          {loading ? "Saving…" : "Reset password"}
        </button>
        <p className="text-center text-sm">
          <Link to="/login" className="text-cyan-300 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
