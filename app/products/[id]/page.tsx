"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Share2, Star, ShoppingCart } from "lucide-react"
import { getProductById } from "@/lib/products-data"

const relatedProducts = [
  {
    id: "w2",
    name: "Hana Badege",
    price: 5000,
    image: "/images/dress.jpg",
  },
  { id: "g1", name: "Traditional Gabi", price: 5000, image: "/images/gabi.jpg" },
  { id: "j1", name: "Silver Jewelry", price: 425, image: "/images/rings2.jpg" },
  {
    id: "m1",
    name: "Men's Traditional",
    price: 3700,
    image: "/images/men.jpg",
  },
]

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = getProductById(id)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState("#4A90E2")

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link href="/shop/women-clothes">
              <Button className="bg-primary hover:bg-primary/90 text-white">Back to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/shop/${product.category}`} className="hover:text-primary">
            {product.category.replace("-", " ").toUpperCase()}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Images */}
            <div>
              <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center relative">
                <Image src={product.image || "/placeholder.jpg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {[product.image, product.image, product.image].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.jpg"}
                      alt={`View ${idx + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">Birr{product.price}</span>
                  <span className="text-lg text-gray-400 line-through">Birr{product.originalPrice}</span>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Colors */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Color</label>
                <div className="flex gap-3">
                  {["#4A90E2", "#50C878", "#FFB6C1", "#000000"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        selectedColor === color ? "border-gray-900" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="px-6 py-3 rounded-lg border-gray-300 bg-transparent">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" className="px-6 py-3 rounded-lg border-gray-300 bg-transparent">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Seller Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  Sold by <span className="font-medium text-gray-900">{product.artisan}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">✓ Verified Seller • Free Shipping</p>
                <Link href="/messages">
                  <Button className="mt-3 w-full bg-primary hover:bg-primary/90 text-white">Contact Seller</Button>
                </Link>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Why Choose This Product</h3>
                <ul className="space-y-2">
                  {[
                    "Authentic handmade design",
                    "Premium quality fabric",
                    "Sustainable production",
                    "One-of-a-kind piece",
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {[
                {
                  author: "Sarah Demse",
                  rating: 5,
                  text: "Beautiful quality and authentic design. Highly recommend!",
                  date: "2 weeks ago",
                },
                { author: "Yohannes Alemu", rating: 4, text: "Great product, delivery was fast.", date: "1 month ago" },
                {
                  author: "Bethelhem Kassa",
                  rating: 5,
                  text: "Exceeded my expectations. Perfect gift!",
                  date: "1 month ago",
                },
              ].map((review, idx) => (
                <div key={idx} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{review.author}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link key={relProduct.id} href={`/products/${relProduct.id}`}>
                  <div className="group cursor-pointer">
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 h-48 relative">
                      <Image
                        src={relProduct.image || "/placeholder.jpg"}
                        alt={relProduct.name}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition">{relProduct.name}</h3>
                    <p className="text-primary font-bold">Birr{relProduct.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
