import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  const load = () =>
    api.get("/users/").then(({ data }) => setUsers(data.results || data));

  useEffect(() => {
    load().catch(() => toast.error("Could not load users"));
  }, []);

  const toggleBlock = async (u) => {
    try {
      await api.patch(`/users/${u.id}/`, {
        is_active: !u.is_active,
      });
      toast.success(u.is_active ? "User deactivated" : "User reactivated");
      load();
    } catch {
      toast.error("Update failed — send subset fields only from API");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/10 text-xs uppercase text-white/50">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Active</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="p-3">
                  <p className="font-medium">{u.username}</p>
                  <p className="text-xs text-white/40">{u.email}</p>
                </td>
                <td className="p-3 text-cyan-200">{u.role}</td>
                <td className="p-3">{u.is_active ? "Yes" : "No"}</td>
                <td className="p-3">
                  <button
                    type="button"
                    className="rounded bg-white/15 px-3 py-1 text-xs hover:bg-white/25"
                    onClick={() => toggleBlock(u)}
                  >
                    {u.is_active ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
