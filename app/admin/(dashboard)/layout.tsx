import type React from "react";
import Link from "next/link";
import { BarChart3, ClipboardList, ShieldCheck, Store, Users } from "lucide-react";
import { requireAdminPage } from "@/lib/admin/server-auth";

const navItems = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/designers", label: "Designers", icon: ShieldCheck },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminPage();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Admin</p>
                <h1 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">Saba Control Center</h1>
                <p className="mt-1 text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto rounded-xl bg-gray-50 p-1 ring-1 ring-gray-100">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex min-w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-primary hover:shadow-sm"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </main>
  );
}
