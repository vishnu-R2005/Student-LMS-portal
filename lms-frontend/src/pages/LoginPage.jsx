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
      const user = await login(form);

      toast.success("Welcome back!");

      if (user?.role === "instructor" || user?.role === "admin") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] px-4">

      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-xl p-8 space-y-6"
      >
        <h2 className="text-2xl text-white text-center">Login</h2>

        <input
          placeholder="Username"
          className="w-full p-3 rounded bg-white/10 text-white"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-white/10 text-white"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-cyan-400 py-3 rounded">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;