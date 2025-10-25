"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, Heart, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center ml-4">
              <Image
                src="/images/sabba.svg"
                alt="Saba Text Logo"
                width={180}
                height={63}
                className="h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm text-gray-700 hover:text-primary transition">
                Home
              </Link>

              {/* Shop Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsShopOpen(true)}
                onMouseLeave={() => setIsShopOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm text-gray-700 hover:text-primary transition">
                  Shop
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isShopOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                    <Link href="/shop/all-products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      All Products
                    </Link>
                    <Link href="/shop/women-clothes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Women Clothes
                    </Link>
                    <Link href="/shop/men-clothes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Men Clothes
                    </Link>
                    <Link href="/shop/jewelry" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Jewelry
                    </Link>
                    <Link href="/shop/gabi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Gabi
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/about" className="text-sm text-gray-700 hover:text-primary transition">
                About
              </Link>
              <Link href="/blog" className="text-sm text-gray-700 hover:text-primary transition">
                Blog
              </Link>
              <Link href="/contact" className="text-sm text-gray-700 hover:text-primary transition">
                Contact
              </Link>
              <Link href="/pages" className="text-sm text-gray-700 hover:text-primary transition">
                Pages
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Search className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                <Heart className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  1
                </span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  1
                </span>
              </button>
              <Link href="/seller-login">
                <Button
                  variant="outline"
                  className="hidden sm:inline-flex text-primary border-primary hover:bg-primary hover:text-white text-sm bg-transparent"
                >
                  Are you a seller?
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex text-primary text-sm">
                  Login / Register
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav className="md:hidden pb-4 space-y-2">
              <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Home
              </Link>

              {/* Mobile Shop Dropdown */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setIsShopOpen(!isShopOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  <span>Shop</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isShopOpen ? "rotate-180" : ""}`} />
                </button>

                {isShopOpen && (
                  <div className="pl-6 py-1 space-y-1 bg-gray-50">
                    <Link href="/shop/all-products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      All Products
                    </Link>
                    <Link href="/shop/women-clothes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      Women Clothes
                    </Link>
                    <Link href="/shop/men-clothes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      Men Clothes
                    </Link>
                    <Link href="/shop/jewelry" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      Jewelry
                    </Link>
                    <Link href="/shop/gabi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                      Gabi
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                About
              </Link>
              <Link href="/blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Blog
              </Link>
               <Link href="/#contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                Contact
              </Link>
            </nav>
          )}
        </div>
      </header>

      <div className="h-6 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 pattern-geometric"></div>
    </>
  )
}
