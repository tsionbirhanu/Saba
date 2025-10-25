"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Package, MapPin, LogOut, Download } from "lucide-react"

const buyerOrders = [
  { id: "ORD001", date: "2024-01-15", total: "$45.99", status: "Delivered", items: 2 },
  { id: "ORD002", date: "2024-01-10", total: "$78.50", status: "Shipped", items: 3 },
  { id: "ORD003", date: "2024-01-05", total: "$32.00", status: "Processing", items: 1 },
]

const wishlistItems = [
  { id: "1", name: "Traditional Dress", price: 16.48, image: "/images/dress.jpg" },
  { id: "2", name: "Gabi Wrap", price: 22.99, image: "/images/gabi-wrap.jpg" },
  { id: "3", name: "Jewelry Set", price: 24.99, image: "/images/jewelry-set.jpg" },
]

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-1">Welcome back, Sarah Doe</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </Link>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 border-b">
            {["orders", "wishlist", "profile", "addresses"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium transition border-b-2 ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {buyerOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{order.id}</h3>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{order.total}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-gray-600">{order.items} items</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                        <Package className="w-4 h-4" />
                        Track
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                        <Download className="w-4 h-4" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition">
                  <div className="relative h-40 bg-gray-100">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100">
                      <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-primary font-bold mb-4">${item.price}</p>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">Add to Cart</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" defaultValue="Sarah Doe" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" defaultValue="sarah@example.com" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-white">Save Changes</Button>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Saved Addresses</h2>
                <Button className="bg-primary hover:bg-primary/90 text-white">Add Address</Button>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">Home</h3>
                      <p className="text-sm text-gray-600 mt-1">123 Main Street, Apt 4B</p>
                      <p className="text-sm text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
