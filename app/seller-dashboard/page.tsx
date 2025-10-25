"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BarChart3, ShoppingBag, Users, TrendingUp, Plus, Edit2, Trash2, Eye, LogOut } from "lucide-react"

const dashboardStats = [
  { label: "Total Sales", value: "$12,450", change: "+12.5%", icon: TrendingUp },
  { label: "Total Orders", value: "248", change: "+8.2%", icon: ShoppingBag },
  { label: "Total Customers", value: "1,240", change: "+5.1%", icon: Users },
  { label: "Revenue", value: "$8,920", change: "+15.3%", icon: BarChart3 },
]

const sellerProducts = [
  {
    id: "1",
    name: "Traditional Dress",
    price: 16.48,
    sales: 45,
    image: "/placeholder.jpg?height=100&width=100&query=traditional-dress",
  },
  {
    id: "2",
    name: "Couples Clothing",
    price: 18.99,
    sales: 32,
    image: "/placeholder.jpg?height=100&width=100&query=couples-clothing",
  },
  {
    id: "3",
    name: "Gabi Wrap",
    price: 22.99,
    sales: 28,
    image: "/placeholder.jpg?height=100&width=100&query=gabi-wrap",
  },
  {
    id: "4",
    name: "Jewelry Set",
    price: 24.99,
    sales: 15,
    image: "/placeholder.jpg?height=100&width=100&query=jewelry-set",
  },
]

const recentOrders = [
  { id: "ORD001", customer: "Sarah Doe", amount: "$45.99", status: "Delivered", date: "2024-01-15" },
  { id: "ORD002", customer: "John Smith", amount: "$32.50", status: "Processing", date: "2024-01-14" },
  { id: "ORD003", customer: "Emma Wilson", amount: "$78.00", status: "Shipped", date: "2024-01-13" },
  { id: "ORD004", customer: "Michael Brown", amount: "$56.25", status: "Pending", date: "2024-01-12" },
]

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Saba Artisans</p>
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
            {["overview", "products", "orders", "analytics"].map((tab) => (
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

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, idx) => {
                  const Icon = stat.icon
                  return (
                    <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
                    </div>
                  )
                })}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900 font-medium">{order.id}</td>
                          <td className="py-3 px-4 text-gray-600">{order.customer}</td>
                          <td className="py-3 px-4 text-gray-900 font-medium">{order.amount}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : order.status === "Shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "Processing"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Your Products</h2>
                <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellerProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative h-40 bg-gray-100">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-primary font-bold">${product.price}</span>
                        <span className="text-sm text-gray-600">{product.sales} sales</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1 bg-transparent"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1 bg-transparent"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:text-red-700 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">All Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 font-medium">{order.id}</td>
                        <td className="py-3 px-4 text-gray-600">{order.customer}</td>
                        <td className="py-3 px-4 text-gray-900 font-medium">{order.amount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "Processing"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Sales Analytics</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Chart visualization would go here</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
