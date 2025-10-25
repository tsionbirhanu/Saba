"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronDown, Grid, List, Heart } from "lucide-react"

const categories = [
  { id: "all", name: "All Products" },
  { id: "women", name: "Women Clothes" },
  { id: "men", name: "Men Clothes" },
  { id: "gabi", name: "Gabi" },
  { id: "jewelry", name: "Jewelry" },
]

const products = [
  {
    id: "1",
    name: "Traditional Attire",
    price: 6400,
    originalPrice: 12000,
    image: "/images/dress.jpg?height=300&width=300&query=traditional-dress-1",
    category: "women",
  },
  {
    id: "2",
    name: "Couples Clothing",
    price: 8900,
    originalPrice: 10000,
    image: "/images/couple.jpg?height=300&width=300&query=couples-clothing",
    category: "all",
  },
  {
    id: "3",
    name: "Men's Traditional",
    price: 4900,
    originalPrice: 5900,
    image: "/images/menn.jpg?height=300&width=300&query=mens-traditional",
    category: "men",
  },
  {
    id: "4",
    name: "Gabi Wrap",
    price: 3500,
    originalPrice: 4000,
    image: "/images/gabi.jpg?height=300&width=300&query=gabi-wrap",
    category: "gabi",
  },
  {
    id: "5",
    name: "Jewelry Set",
    price: 1000,
    originalPrice: 2000,
    image: "/images/rings2.jpg?height=300&width=300&query=jewelry-set",
    category: "jewelry",
  },
  {
    id: "6",
    name: "Women's Dress",
    price: 7000,
    originalPrice: 9000,
    image: "/images/dress.jpg?height=300&width=300&query=womens-dress",
    category: "women",
  },
  {
    id: "7",
    name: "Men's Shirt",
    price: 3700,
    originalPrice: 5000,
    image: "/images/men4.jpg?height=300&width=300&query=mens-shirt",
    category: "men",
  },
  {
    id: "8",
    name: "Beaded Necklace",
    price: 1599,
    originalPrice: 2500,
    image: "/images/rings.png?height=300&width=300&query=beaded-necklace",
    category: "jewelry",
  },
  {
    id: "9",
    name: "Gabi Shawl",
    price: 1800,
    originalPrice: 3000,
    image: "/images/gabi00.jpg?height=300&width=300&query=gabi-shawl",
    category: "gabi",
  },
  {
    id: "10",
    name: "Traditional Dress",
    price: 4900,
    originalPrice: 5900,
    image: "/images/dress.jpg?height=300&width=300&query=traditional-dress-2",
    category: "women",
  },
  {
    id: "11",
    name: "Men's Jacket",
    price: 4000,
    originalPrice: 4800,
    image: "/images/men1.jpg?height=300&width=300&query=mens-jacket",
    category: "all",
  },
  {
    id: "12",
    name: "Gold Earrings",
    price: 5000,
    originalPrice: 7000,
    image: "/images/rings4.jpg?height=300&width=300&query=gold-earrings",
    category: "jewelry",
  },
]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory)

  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
            <p className="text-gray-600 mt-2">Discover authentic handmade products from women artisans</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-20">
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id)
                        setCurrentPage(1)
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === cat.id ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Price Filter */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                  <input type="range" min="0" max="100" className="w-full" />
                  <div className="flex gap-2 mt-4">
                    <input type="number" placeholder="Min" className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" placeholder="Max" className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Showing {paginatedProducts.length} of {filteredProducts.length} products
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-white" : "bg-gray-100"}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-white" : "bg-gray-100"}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border rounded-lg appearance-none pr-8 bg-white"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div
                className={`grid gap-6 mb-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
              >
                {paginatedProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition group">
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 transition">
                          <Heart className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary transition">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-primary font-bold">Birr{product.price}</span>
                          <span className="text-gray-400 line-through text-sm">Birr{product.originalPrice}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1 ? "bg-primary text-white" : "border hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
