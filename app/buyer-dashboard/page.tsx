"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ReviewForm } from "@/components/review-form";
import { Heart, Package, MapPin, LogOut, Download, MessageSquare } from "lucide-react";
import {
  ApiFavorite,
  ApiOrder,
  ApiUser,
  getFavorites,
  getLoggedInUser,
  getOrders,
  removeFavorite,
  updateOrderStatus,
} from "@/lib/api-client";

export default function BuyerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [favorites, setFavorites] = useState<ApiFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const [currentUser, orderResponse, favoriteRows] = await Promise.all([
        getLoggedInUser(),
        getOrders(),
        getFavorites(),
      ]);

      setUser(currentUser);
      setOrders(orderResponse.orders.filter((order) => order.buyerId === currentUser.id));
      setFavorites(favoriteRows);
    } catch {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const requestedTab = new URLSearchParams(window.location.search).get("tab");
    if (requestedTab && ["orders", "wishlist", "profile", "addresses"].includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    router.push("/");
  };

  async function handleCancel(orderId: string) {
    setStatus("");
    try {
      await updateOrderStatus(orderId, "CANCELLED");
      setStatus("Order cancelled.");
      await loadDashboard();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not cancel order.");
    }
  }

  async function handleRemoveFavorite(productId: string) {
    setStatus("");
    try {
      await removeFavorite(productId);
      setStatus("Removed from favorites.");
      await loadDashboard();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not remove favorite.");
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/messages">
                <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white">
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {status && <div className="mb-6 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">{status}</div>}

          <div className="flex gap-4 mb-8 border-b overflow-x-auto">
            {["orders", "wishlist", "profile", "addresses"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  router.replace(`/buyer-dashboard?tab=${tab}`, { scroll: false });
                }}
                className={`px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === tab ? "border-primary text-primary" : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-lg p-10 text-center shadow-sm">
                  <Package className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">You have not placed any orders yet.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{getOrderTitle(order)}</h3>
                        <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="font-bold text-gray-900">Birr {order.totalAmount.toLocaleString()}</p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 text-green-700"
                              : order.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : order.status === "PAID"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t">
                      <span className="text-sm text-gray-600">{getOrderQuantity(order)} item(s)</span>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => setStatus(`Order status: ${order.status}`)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 bg-transparent"
                        >
                          <Package className="w-4 h-4" />
                          Track
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                          <Download className="w-4 h-4" />
                          Invoice
                        </Button>
                        {order.status === "PENDING" && (
                          <Button
                            onClick={() => handleCancel(order.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 bg-transparent"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                    {order.status === "DELIVERED" && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <p className="text-sm font-medium text-gray-900">Leave a review</p>
                        {getReviewableProducts(order).map((product) => (
                          <ReviewForm
                            key={product.id}
                            productId={product.id}
                            productName={product.name}
                            onSaved={loadDashboard}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <>
              {favorites.length === 0 ? (
                <div className="bg-white rounded-lg p-10 text-center shadow-sm">
                  <Heart className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No favorites yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
                      <Link href={`/products/${favorite.product.id}`}>
                        <div className="relative h-40 bg-gray-100">
                          <Image
                            src={favorite.product.image || "/images/dress.jpg"}
                            alt={favorite.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">{favorite.product.name}</h3>
                        <p className="text-primary font-bold mb-4">Birr {favorite.product.price.toLocaleString()}</p>
                        <Button
                          onClick={() => handleRemoveFavorite(favorite.product.id)}
                          variant="outline"
                          className="w-full text-red-600 bg-transparent"
                        >
                          Remove Favorite
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" value={user.name} readOnly className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={user.email} readOnly className="w-full px-4 py-2 border rounded-lg bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={user.phoneNumber || ""}
                    readOnly
                    placeholder="No phone on file"
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">No saved addresses</h3>
                    <p className="text-sm text-gray-600 mt-1">Address management is not backed by an API yet.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function getOrderTitle(order: ApiOrder) {
  const items = order.items || [];
  if (items.length === 0) return order.product.name;
  if (items.length === 1) return items[0].product.name;
  return `${items[0].product.name} + ${items.length - 1} more`;
}

function getOrderQuantity(order: ApiOrder) {
  return order.items?.reduce((sum, item) => sum + item.quantity, 0) || order.quantity;
}

function getReviewableProducts(order: ApiOrder) {
  const map = new Map<string, ApiOrder["product"]>();
  if (order.product) map.set(order.product.id, order.product);
  order.items?.forEach((item) => map.set(item.product.id, item.product));
  return Array.from(map.values());
}
