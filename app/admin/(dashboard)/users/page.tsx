"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { AdminClientGuard } from "../admin-client-guard";
import { ApiUser, getAdminUsers } from "@/lib/api-client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load users."));
  }, []);

  return (
    <>
      <AdminClientGuard />
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Users</h2>
        <p className="text-gray-600 mt-1">All registered accounts.</p>
      </div>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{user.role}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{new Date(user.createdAt || "").toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/users?view=${user.id}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                    <Eye className="w-4 h-4" />
                    View detail
                  </Link>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
