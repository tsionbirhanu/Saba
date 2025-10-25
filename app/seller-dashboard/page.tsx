"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  BarChart3,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Eye,
  LogOut,
  Star,
} from "lucide-react"

const dashboardStats = [
  { label: "Total Sales", value: "Br 12,450", change: "+12.5%", icon: TrendingUp },
  { label: "Total Orders", value: "248", change: "+8.2%", icon: ShoppingBag },
  { label: "Total Customers", value: "1,240", change: "+5.1%", icon: Users },
  { label: "Revenue", value: "Br 8,920", change: "+15.3%", icon: BarChart3 },
]

const sellerProducts = [
  {
    id: "1",
    name: "Traditional Dress",
    price: 16.48,
    sales: 45,
    image: "/placeholder.jpg",
  },
  {
    id: "2",
    name: "Couples Clothing",
    price: 18.99,
    sales: 32,
    image: "/placeholder.jpg",
  },
  {
    id: "3",
    name: "Gabi Wrap",
    price: 22.99,
    sales: 28,
    image: "/placeholder.jpg",
  },
]

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* --- Dashboard Header --- */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </Link>
          </div>

          {/* --- Profile Card --- */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-36 h-36 rounded-full overflow-hidden bg-gray-200">
              <Image
                src="/placeholder.jpg" // replace with seller profile image
                alt="Seller Profile"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Saba Artisans</h2>
              <div className="flex items-center gap-1 mt-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400" />
                ))}
                <span className="text-gray-600 text-sm">(4.8)</span>
              </div>
              <p className="text-gray-700 mb-2 line-clamp-3">
                Welcome to Saba Artisans! We craft and sell beautiful traditional Ethiopian clothing and accessories. Our mission is to deliver high-quality handmade products to customers worldwide.
              </p>
              <Button size="sm" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          {/* --- Navigation Tabs --- */}
          <div className="flex gap-4 border-b">
            {["overview", "products", "analytics"].map((tab) => (
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

          {/* --- Overview Tab --- */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          )}

          {/* --- Products Tab --- */}
          {activeTab === "products" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Your Products</h2>
                <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Image
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellerProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative h-40 bg-gray-100">
                      <Image
                        src={product.image}
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

          {/* --- Analytics Tab --- */}
          {activeTab === "analytics" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Sales Analytics</h2>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-600">Chart visualization goes here</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
