"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, ReceiptText } from "lucide-react";
import { ApiOrder, getAdminOrders } from "@/lib/api-client";
import { AdminClientGuard } from "../admin-client-guard";

const statuses = ["", "PENDING", "PAID", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [error, setError] = useState("");

  const loadOrders = useCallback(async (nextFilters: { status?: string; dateFrom?: string; dateTo?: string } = {}) => {
    setError("");
    try {
      setOrders(await getAdminOrders(nextFilters));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load orders.");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => loadOrders({ status: "", dateFrom: "", dateTo: "" }));
  }, [loadOrders]);

  const totalRevenue = useMemo(
    () => orders.filter((order) => order.status === "PAID" || order.status === "DELIVERED").reduce((sum, order) => sum + order.totalAmount, 0),
    [orders]
  );

  return (
    <>
      <AdminClientGuard />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Orders</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">Platform Orders</h2>
          <p className="mt-1 text-gray-600">Monitor payment references, order states, and totals.</p>
        </div>
        <div className="rounded-lg bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-gray-100">
          <span className="text-gray-500">Visible paid revenue: </span>
          <span className="font-bold text-gray-950">Br {totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          loadOrders({ status, dateFrom, dateTo });
        }}
        className="mb-6 grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 md:grid-cols-4"
      >
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5">
          {statuses.map((value) => (
            <option key={value || "all"} value={value}>{value || "All statuses"}</option>
          ))}
        </select>
        <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5" />
        <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5" />
        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90">
          <Filter className="h-4 w-4" />
          Apply Filters
        </button>
      </form>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-[940px] w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-5 py-4 font-medium">Order</th>
                <th className="px-5 py-4 font-medium">Buyer</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Payment Ref</th>
                <th className="px-5 py-4 font-medium">Total</th>
                <th className="px-5 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                        <ReceiptText className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-medium text-gray-950">{getOrderTitle(order)}</p>
                        <p className="text-xs text-gray-500">{order.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-950">{order.buyer?.name || "Buyer"}</p>
                    <p className="text-gray-500">{order.buyer?.email || "No email"}</p>
                  </td>
                  <td className="px-5 py-4"><OrderStatus status={order.status} /></td>
                  <td className="px-5 py-4 text-gray-600">{order.paymentRef || "No payment ref"}</td>
                  <td className="px-5 py-4 font-semibold text-gray-950">Br {order.totalAmount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function getOrderTitle(order: ApiOrder) {
  const items = order.items || [];
  if (items.length === 0) return order.product?.name || "Order";
  if (items.length === 1) return items[0].product.name;
  return `${items[0].product.name} + ${items.length - 1} more`;
}

function OrderStatus({ status }: { status: ApiOrder["status"] }) {
  const classes =
    status === "PAID"
      ? "bg-blue-100 text-blue-700"
      : status === "DELIVERED"
        ? "bg-emerald-100 text-emerald-700"
        : status === "CANCELLED"
          ? "bg-red-100 text-red-700"
          : "bg-amber-100 text-amber-700";

  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>{status}</span>;
}
