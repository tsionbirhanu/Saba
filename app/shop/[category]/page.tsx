"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, ChevronDown, Grid, List } from "lucide-react"

const categoryData = {
  "women-clothes": {
    name: "Women Clothes",
    description: "Discover our collection of traditional and modern women's clothing",
  },
  "men-clothes": {
    name: "Men Clothes",
    description: "Explore authentic men's traditional and contemporary wear",
  },
  gabi: {
    name: "Gabi",
    description: "Traditional wraps and shawls for every occasion",
  },
  jewelry: {
    name: "Jewelry",
    description: "Handcrafted jewelry pieces from local artisans",
  },
}

const products = [
  {
    id: "1",
    name: "Traditional Dress",
    price: 6.48,
    originalPrice: 16.48,
    image: "/placeholder.jpg",
  },
  {
    id: "2",
    name: "Elegant Gown",
    price: 8.99,
    originalPrice: 18.99,
    image: "/placeholder.jpg",
  },
  {
    id: "3",
    name: "Casual Wear",
    price: 5.99,
    originalPrice: 15.99,
    image: "/placeholder.jpg",
  },
  {
    id: "4",
    name: "Formal Attire",
    price: 12.99,
    originalPrice: 22.99,
    image: "/placeholder.jpg",
  },
  {
    id: "5",
    name: "Summer Collection",
    price: 7.49,
    originalPrice: 17.49,
    image: "/placeholder.jpg",
  },
  {
    id: "6",
    name: "Winter Wear",
    price: 10.99,
    originalPrice: 20.99,
    image: "/placeholder.jpg",
  },
  {
    id: "7",
    name: "Party Dress",
    price: 14.99,
    originalPrice: 24.99,
    image: "/placeholder.jpg",
  },
  {
    id: "8",
    name: "Casual Outfit",
    price: 9.99,
    originalPrice: 19.99,
    image: "/placeholder.jpg",
  },
]

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryKey } = use(params)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)

  const category = categoryData[categoryKey as keyof typeof categoryData] || categoryData["women-clothes"]
  const itemsPerPage = 12
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Category Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-600 mt-2">{category.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-20">
                <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <input type="range" min="0" max="100" className="w-full" />
                  <div className="flex gap-2 mt-4">
                    <input type="number" placeholder="Min" className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
                    <input type="number" placeholder="Max" className="w-1/2 px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>

                {/* Color Filter */}
                <div className="mb-6 pb-6 border-b">
                  <h4 className="font-medium text-gray-900 mb-3">Colors</h4>
                  <div className="space-y-2">
                    {["Red", "Blue", "Green", "Black", "White"].map((color) => (
                      <label key={color} className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded" />
                        <span className="text-sm text-gray-600">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded" />
                        <span className="text-sm text-gray-600">{"★".repeat(rating)} & up</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {paginatedProducts.length} of {products.length} products
                </span>
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
                          <span className="text-primary font-bold">${product.price}</span>
                          <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
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
