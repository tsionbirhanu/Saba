"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Share2, Star, ShoppingCart } from "lucide-react"

const productData = {
  id: "1",
  name: "Couples Clothing",
  price: 6.48,
  originalPrice: 16.48,
  rating: 4.5,
  reviews: 128,
  description: "We celebrate togetherness in style. Matching tradition, woven with love. A perfect pair, made to last.",
  colors: ["#4A90E2", "#50C878", "#FFB6C1", "#000000"],
  images: ["/images/dress.jpg", "/images/dress.jpg", "/images/dress.jpg"],
  seller: "Saba Artisans",
  inStock: true,
  features: ["Authentic handmade design", "Premium quality fabric", "Sustainable production", "One-of-a-kind piece"],
  reviews_list: [
    {
      author: "Sarah Doe",
      rating: 5,
      text: "Beautiful quality and authentic design. Highly recommend!",
      date: "2 weeks ago",
    },
    {
      author: "John Smith",
      rating: 4,
      text: "Great product, delivery was fast.",
      date: "1 month ago",
    },
    {
      author: "Emma Wilson",
      rating: 5,
      text: "Exceeded my expectations. Perfect gift!",
      date: "1 month ago",
    },
  ],
}

const relatedProducts = [
  {
    id: "2",
    name: "Traditional Attire",
    price: 6.48,
    image: "/images/dress.jpg",
  },
  { id: "3", name: "Gabi Wrap", price: 8.99, image: "/placeholder.jpg" },
  { id: "4", name: "Jewelry Set", price: 12.99, image: "/placeholder.jpg" },
  {
    id: "5",
    name: "Men's Traditional",
    price: 9.99,
    image: "/placeholder.jpg",
  },
]

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  use(params)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(productData.colors[0])

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
          <Link href="/shop/all-products" className="hover:text-primary">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{productData.name}</span>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Images */}
            <div>
              <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center relative">
                <Image
                  src={productData.images[selectedImage] || "/images/dress.jpg"}
                  alt={productData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {productData.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img || "/images/dress.jpg"}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productData.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(productData.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({productData.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">Birr{productData.price}</span>
                  <span className="text-lg text-gray-400 line-through">Birr{productData.originalPrice}</span>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)}%
                    OFF
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{productData.description}</p>

              {/* Colors */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Color</label>
                <div className="flex gap-3">
                  {productData.colors.map((color) => (
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
                  Sold by <span className="font-medium text-gray-900">{productData.seller}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">✓ Verified Seller • Free Shipping</p>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Why Choose This Product</h3>
                <ul className="space-y-2">
                  {productData.features.map((feature, idx) => (
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
              {productData.reviews_list.map((review, idx) => (
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
              {relatedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="group cursor-pointer">
                    <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 h-48 relative">
                      <Image
                        src={product.image || "/images/dress.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition">{product.name}</h3>
                    <p className="text-primary font-bold">Birr{product.price}</p>
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
