import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success("Account created 🎉");
      navigate("/dashboard");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a1a40] via-[#2a0845] to-[#0f2027] px-4">
      
      {/* Glow Effects */}
      <div className="absolute w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <form
        onSubmit={submit}
        className="relative w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.2)] p-8 space-y-6 border border-white/10"
      >
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            Create Account ✨
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Start your learning journey today
          </p>
        </div>

        {/* Username */}
        <input
          className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400 focus:shadow-[0_0_10px_#6366f1]"
          placeholder="Username"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        {/* Email */}
        <input
          className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400 focus:shadow-[0_0_10px_#6366f1]"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password */}
        <input
          type="password"
          className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-indigo-400 focus:shadow-[0_0_10px_#6366f1]"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Role */}
        <select
          className="w-full rounded-lg bg-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>

        {/* Button */}
        <button className="w-full rounded-lg bg-indigo-500 text-white font-semibold py-3 hover:bg-indigo-400 transition hover:shadow-[0_0_15px_#6366f1]">
          Create Account
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-white/60">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-300 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;