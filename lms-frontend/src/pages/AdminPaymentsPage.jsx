import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

/** Manual payment records for reporting (integrate gateways via webhooks separately). */
const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    user: "",
    course: "",
    amount: "",
    currency: "USD",
    provider: "manual",
    status: "paid",
  });

  const load = () =>
    api.get("/learning/payments/").then(({ data }) => setPayments(data.results || data));

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post("/learning/payments/", {
        user: Number(form.user),
        course: form.course ? Number(form.course) : null,
        amount: form.amount,
        currency: form.currency,
        provider: form.provider,
        status: form.status,
        external_id: "",
        meta: {},
      });
      toast.success("Recorded");
      load();
    } catch {
      toast.error("Create failed — check IDs");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Payments & revenue</h1>
      <form onSubmit={add} className="grid gap-3 max-w-lg md:grid-cols-2 text-sm">
        <input
          placeholder="Student user ID"
          className="rounded bg-black/40 p-2 md:col-span-2"
          value={form.user}
          onChange={(e) => setForm({ ...form, user: e.target.value })}
        />
        <input
          placeholder="Course ID (optional)"
          className="rounded bg-black/40 p-2"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
        <input
          placeholder="Amount"
          className="rounded bg-black/40 p-2"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <button
          type="submit"
          className="rounded bg-emerald-500 py-2 font-semibold text-black md:col-span-2"
        >
          Record payment
        </button>
      </form>
      <ul className="text-xs space-y-1 font-mono text-white/65">
        {payments.map((p) => (
          <li key={p.id}>
            #{p.id} user {p.user} · ${p.amount} {p.currency} · {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPaymentsPage;
