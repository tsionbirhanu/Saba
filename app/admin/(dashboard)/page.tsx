"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { AdminClientGuard } from "./admin-client-guard";
import { ApiAdminOverview, getAdminOverview } from "@/lib/api-client";

const cards = [
  { key: "totalUsers", label: "Total Users", helper: "All registered accounts", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { key: "totalDesigners", label: "Designers", helper: "Seller profiles", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
  { key: "totalOrders", label: "Orders", helper: "Platform order volume", icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-50" },
  { key: "totalRevenue", label: "Paid Revenue", helper: "Sum of paid orders", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
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
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Overview</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">Platform Health</h2>
          <p className="mt-1 text-gray-600">Live metrics from users, designers, orders, and paid revenue.</p>
        </div>
        <Link href="/admin/designers" className="inline-flex w-fit rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
          Review Designers
        </Link>
      </div>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const value = overview?.[card.key] ?? 0;
          return (
            <div key={card.key} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">{card.label}</h3>
                  <p className="mt-1 text-xs text-gray-500">{card.helper}</p>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-950">
                {card.key === "totalRevenue" ? `Br ${Number(value).toLocaleString()}` : Number(value).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {overview && (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
            <h3 className="font-semibold text-gray-950">Designer Verification</h3>
            <p className="mt-1 text-sm text-gray-600">Trust signal coverage across seller accounts.</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm text-emerald-700">Verified</p>
                <p className="mt-1 text-2xl font-bold text-emerald-900">{overview.verifiedDesigners}</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-sm text-amber-700">Pending</p>
                <p className="mt-1 text-2xl font-bold text-amber-900">{overview.pendingDesigners}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-primary p-6 text-white shadow-sm">
            <h3 className="font-semibold">Admin Checklist</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              <li>Review pending seller IDs.</li>
              <li>Watch unpaid or cancelled orders.</li>
              <li>Keep verified designer listings healthy.</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
