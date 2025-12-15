"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  Eye,
  Wallet,
  Package,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react"


const dashboardStats = [
  { label: "Total Revenue", value: "Br 12,450", change: "+12.5%", icon: TrendingUp, color: "text-green-600" },
  { label: "Total Orders", value: "248", change: "+8.2%", icon: ShoppingBag, color: "text-blue-600" },
  { label: "Active Products", value: "42", change: "+5.1%", icon: Package, color: "text-purple-600" },
  { label: "Wallet Balance", value: "₳ 1,250", change: "+15.3%", icon: Wallet, color: "text-orange-600" },
]

const recentProducts = [
  {
    id: "1",
    name: "Traditional Habesha Dress",
    price: 1648,
    sales: 45,
    stock: 120,
    image: "/images/dress.jpg",
    status: "active"
  },
  {
    id: "2",
    name: "Couples Traditional Wear",
    price: 2899,
    sales: 32,
    stock: 85,
    image: "/images/couple.jpg",
    status: "active"
  },
  {
    id: "3",
    name: "Handwoven Gabi",
    price: 2299,
    sales: 28,
    stock: 65,
    image: "/images/gabi.jpg",
    status: "low-stock"
  },
]

export default function SellerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState<any>(null)
  const [walletStatus, setWalletStatus] = useState<"connected" | "not-connected">("connected")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    
    if (!token || !userStr) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(userStr)
    if (userData.role !== "DESIGNER") {
      router.push("/")
      return
    }

    setUser(userData)
    setWalletStatus(userData.designerProfile?.walletVerified ? "connected" : "not-connected")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("email")
    router.push("/")
  }

  const getWalletStatusBadge = () => {
    if (walletStatus === "connected") {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Wallet Connected
        </span>
      )
    }
    return (
      <Link href="/connect-wallet">
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center gap-1 hover:bg-red-200 transition">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          Connect Wallet
        </span>
      </Link>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800020]"></div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
                {getWalletStatusBadge()}
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 p-6 bg-gradient-to-r from-[#800020] to-[#a00030] rounded-2xl text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user.name || "Seller"}! 👋
                </h2>
                <p className="opacity-90">
                  Your store is performing great. Keep up the good work!
                </p>
              </div>
              
              <Button 
                className="bg-white text-[#800020] hover:bg-gray-100 font-semibold"
                onClick={() => router.push("/seller/products/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>
          </div>

          <div className="flex gap-1 mb-8 p-1 bg-gray-100 rounded-xl max-w-3xl">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "wallet", label: "Wallet", icon: Wallet },
              { id: "settings", label: "Settings", icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? "bg-white text-[#800020] shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dashboardStats.map((stat, idx) => {
                    const Icon = stat.icon
                    return (
                      <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change} from last month</p>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-[#800020] hover:bg-red-50 transition text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                          <Plus className="w-5 h-5 text-[#800020]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Add Product</p>
                          <p className="text-sm text-gray-500">List new item</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-[#800020] hover:bg-red-50 transition text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">View Earnings</p>
                          <p className="text-sm text-gray-500">Check balance</p>
                        </div>
                      </div>
                    </button>
                    
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-[#800020] hover:bg-red-50 transition text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Customers</p>
                          <p className="text-sm text-gray-500">View all buyers</p>
                        </div>
                      </div>
                    </button>
                    
                    <Link 
                      href="/connect-wallet"
                      className="p-4 border border-gray-200 rounded-lg hover:border-[#800020] hover:bg-red-50 transition text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Wallet</p>
                          <p className="text-sm text-gray-500">Manage funds</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                    <Link 
                      href="/seller/products"
                      className="text-sm text-[#800020] font-medium hover:underline"
                    >
                      View all →
                    </Link>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-600 border-b">
                          <th className="pb-3 font-medium">Product</th>
                          <th className="pb-3 font-medium">Price</th>
                          <th className="pb-3 font-medium">Sales</th>
                          <th className="pb-3 font-medium">Stock</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProducts.map((product) => (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                  />
                                </div>
                                <span className="font-medium text-gray-900">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-4">Br {product.price.toLocaleString()}</td>
                            <td className="py-4">{product.sales}</td>
                            <td className="py-4">{product.stock}</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                product.status === "active" 
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {product.status === "active" ? "Active" : "Low Stock"}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <Eye className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <Edit2 className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === "products" && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Management</h3>
                  <p className="text-gray-600 mb-6">Manage all your products in one place</p>
                  <Button 
                    className="bg-[#800020] hover:bg-[#660018] text-white"
                    onClick={() => router.push("/seller/products/new")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-50 to-orange-50 flex items-center justify-center">
                    <Wallet className="w-12 h-12 text-[#800020]" />
                  </div>
                  
                  {walletStatus === "connected" ? (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Wallet Connected</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Your Cardano wallet is connected and ready for secure transactions. 
                        You can now receive payments for your sales.
                      </p>
                      <div className="space-y-4 max-w-sm mx-auto">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
                          <p className="text-2xl font-bold text-gray-900">₳ 1,250</p>
                        </div>
                        <div className="flex gap-3 justify-center">
                          <Button variant="outline" className="border-gray-300">
                            View Transactions
                          </Button>
                          <Button className="bg-[#800020] hover:bg-[#660018] text-white">
                            Withdraw Funds
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Connect a Cardano wallet to receive payments for your sales. 
                        This is required for seller verification.
                      </p>
                      <Button 
                        className="bg-[#800020] hover:bg-[#660018] text-white"
                        onClick={() => router.push("/connect-wallet")}
                      >
                        Connect Wallet Now
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}