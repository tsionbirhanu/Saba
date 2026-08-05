"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Search, UserRound } from "lucide-react";
import { AdminClientGuard } from "../admin-client-guard";
import { ApiUser, getAdminUsers } from "@/lib/api-client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load users."));
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [search, users]);

  return (
    <>
      <AdminClientGuard />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Users</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">Account Directory</h2>
          <p className="mt-1 text-gray-600">All registered buyer, designer, and admin accounts.</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Joined</th>
                <th className="px-5 py-4 font-medium">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserRound className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-medium text-gray-950">{user.name}</p>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-4 text-gray-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</td>
                  <td className="px-5 py-4">
                    <a href={`mailto:${user.email}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 font-medium text-gray-700 hover:bg-gray-50">
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function RoleBadge({ role }: { role: ApiUser["role"] }) {
  const classes =
    role === "ADMIN"
      ? "bg-primary/10 text-primary"
      : role === "DESIGNER"
        ? "bg-purple-100 text-purple-700"
        : "bg-blue-100 text-blue-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{role}</span>;
}
