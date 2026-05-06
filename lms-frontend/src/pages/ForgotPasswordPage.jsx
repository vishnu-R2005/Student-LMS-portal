import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/password_reset_request/", { email: email.trim() });
      toast.success("Check your inbox (or console logs in development).");
      setSent(true);
    } catch {
      toast.error("Could not submit request.");
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
        <h2 className="text-xl text-center">Forgot password</h2>
        <p className="text-sm text-white/60 text-center">
          Enter your email. If an LMS account matches it, reset instructions follow.
        </p>
        <input
          type="email"
          required
          className="w-full rounded bg-white/10 p-3 outline-none ring-cyan-400 focus:ring"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={sent}
        />
        <button
          type="submit"
          disabled={loading || sent}
          className="w-full rounded bg-cyan-400 py-3 font-semibold text-black disabled:opacity-50"
        >
          {sent ? "Request sent" : loading ? "Sending…" : "Send reset link"}
        </button>
        <p className="text-center text-sm">
          <Link to="/login" className="text-cyan-300 hover:underline">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
