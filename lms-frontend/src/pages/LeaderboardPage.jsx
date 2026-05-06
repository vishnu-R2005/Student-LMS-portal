import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function LeaderboardPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api
      .get("/learning/leaderboard/")
      .then(({ data }) => setRows(data || []))
      .catch(() => toast.error("Could not load leaderboard"));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Leaderboard</h1>
      <p className="text-sm text-white/55">
        Ranked by total quiz scores across all attempts — gamification-ready.
      </p>
      <ol className="space-y-2 text-sm">
        {rows.map((r, idx) => (
          <li
            key={r.student_id}
            className="flex justify-between rounded-lg border border-white/10 px-4 py-3 bg-white/5"
          >
            <span className="text-white/80">
              <span className="text-cyan-400 mr-3 font-mono">#{idx + 1}</span>
              {r.username}
            </span>
            <span className="text-amber-200">
              {(Number(r.total_score) || 0).toFixed(1)} pts · {r.attempts} attempts
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
