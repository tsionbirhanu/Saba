"use client";

import { useEffect, useState } from "react";
import { ClipboardList, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { AdminClientGuard } from "./admin-client-guard";
import { ApiAdminOverview, getAdminOverview } from "@/lib/api-client";

const cards = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "text-blue-600" },
  { key: "totalDesigners", label: "Designers", icon: ShieldCheck, color: "text-purple-600" },
  { key: "totalOrders", label: "Orders", icon: ClipboardList, color: "text-orange-600" },
  { key: "totalRevenue", label: "Paid Revenue", icon: TrendingUp, color: "text-green-600" },
] as const;

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<ApiAdminOverview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminOverview()
      .then(setOverview)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load admin overview."));
  }, []);

  return (
    <>
      <AdminClientGuard />
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-600 mt-1">Live platform metrics from Prisma aggregates.</p>
      </div>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const value = overview?.[card.key] ?? 0;
          return (
            <div key={card.key} className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{card.label}</h3>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {card.key === "totalRevenue" ? `Br ${Number(value).toLocaleString()}` : Number(value).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {overview && (
        <div className="mt-6 bg-white rounded-lg border p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Designer Verification</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <span>Verified: {overview.verifiedDesigners}</span>
            <span>Pending: {overview.pendingDesigners}</span>
          </div>
        </div>
      )}
    </>
  );
}
