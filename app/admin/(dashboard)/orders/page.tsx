"use client";

import { useEffect, useState } from "react";
import { ApiOrder, getAdminOrders } from "@/lib/api-client";
import { AdminClientGuard } from "../admin-client-guard";

const statuses = ["", "PENDING", "PAID", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [error, setError] = useState("");

  async function loadOrders(nextFilters = { status, dateFrom, dateTo }) {
    try {
      setOrders(await getAdminOrders(nextFilters));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load orders.");
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      getAdminOrders()
        .then(setOrders)
        .catch((err) => setError(err instanceof Error ? err.message : "Could not load orders."));
    });
  }, []);

  return (
    <>
      <AdminClientGuard />
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
        <p className="text-gray-600 mt-1">All platform orders and payment references.</p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          loadOrders();
        }}
        className="bg-white rounded-lg border p-4 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="px-3 py-2 border rounded-lg">
          {statuses.map((value) => (
            <option key={value || "all"} value={value}>{value || "All statuses"}</option>
          ))}
        </select>
        <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="px-3 py-2 border rounded-lg" />
        <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="px-3 py-2 border rounded-lg" />
        <button className="rounded-lg bg-primary px-4 py-2 text-white font-medium">Apply Filters</button>
      </form>

      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Buyer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Payment Ref</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{getOrderTitle(order)}</p>
                  <p className="text-xs text-gray-500">{order.id}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-gray-900">{order.buyer?.name || "Buyer"}</p>
                  <p className="text-gray-500">{order.buyer?.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{order.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{order.paymentRef || "No payment ref"}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">Br {order.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-500">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
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
