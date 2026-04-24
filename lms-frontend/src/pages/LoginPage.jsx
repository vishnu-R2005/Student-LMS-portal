import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">
      
      {/* Glow Background Effect */}
      <div className="absolute w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.1)] p-8 space-y-6 border border-white/10"
      >
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            Student Portal
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Stay consistent. Keep learning 🚀
          </p>
        </div>

        {/* Username */}
        <div>
          <label className="text-sm text-white/60">Username</label>
          <input
            className="mt-1 w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-[0_0_10px_#22d3ee]"
            placeholder="Enter your username"
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-white/60">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-cyan-400 focus:shadow-[0_0_10px_#22d3ee]"
            placeholder="Enter your password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-cyan-400/90 text-black font-semibold py-3 transition hover:bg-cyan-300 hover:shadow-[0_0_15px_#22d3ee] disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-white/60">
          New here?{" "}
         <span
            onClick={() => navigate("/register")}
            className="text-cyan-300 font-semibold cursor-pointer hover:underline"
            >           
            Create account
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;