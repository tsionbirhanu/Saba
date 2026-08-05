"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, User, Heart, ShoppingCart, ChevronDown, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ApiNotification, getCart, getGuestCart, getNotifications, markNotificationsRead } from "@/lib/api-client"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header({ showPattern = true }: { showPattern?: boolean } = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [notifications, setNotifications] = useState<ApiNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    function refreshAuthState() {
      const token = localStorage.getItem("token")
      const userStr = localStorage.getItem("user")

      if (token && userStr) {
        setIsLoggedIn(true)
        try {
          const userData = JSON.parse(userStr)
          setUserName(userData.name || userData.email || "User")
          setUserRole(userData.role || "CUSTOMER")
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      } else {
        setIsLoggedIn(false)
        setUserName("")
        setUserRole("")
      }
    }

    queueMicrotask(refreshAuthState)
  }, [])

  useEffect(() => {
    async function loadCartCount() {
      const token = localStorage.getItem("token")
      if (!token) {
        setCartCount(getGuestCart().reduce((sum, item) => sum + item.quantity, 0))
        return
      }

      try {
        const response = await getCart()
        setCartCount(response.itemCount)
      } catch {
        setCartCount(0)
      }
    }

    loadCartCount()
    window.addEventListener("guest-cart-updated", loadCartCount)
    window.addEventListener("cart-updated", loadCartCount)

    return () => {
      window.removeEventListener("guest-cart-updated", loadCartCount)
      window.removeEventListener("cart-updated", loadCartCount)
    }
  }, [isLoggedIn])

  useEffect(() => {
    async function loadNotifications() {
      if (!localStorage.getItem("token")) {
        setNotifications([])
        setUnreadCount(0)
        return
      }

      try {
        const response = await getNotifications()
        setNotifications(response.notifications)
        setUnreadCount(response.unreadCount)
      } catch {
        setNotifications([])
        setUnreadCount(0)
      }
    }

    loadNotifications()
    const timer = window.setInterval(loadNotifications, 60000)
    return () => window.clearInterval(timer)
  }, [isLoggedIn])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("email")
    document.cookie = "token=; path=/; max-age=0; SameSite=Lax"
    setIsLoggedIn(false)
    setUserName("")
    setUserRole("")
    setCartCount(getGuestCart().reduce((sum, item) => sum + item.quantity, 0))
    router.push("/")
  }

  const handleProfileClick = () => {
    if (userRole === "DESIGNER") {
      router.push("/seller-dashboard")
    } else if (userRole === "ADMIN") {
      router.push("/admin")
    } else {
      router.push("/buyer-dashboard?tab=profile")
    }
  }

  async function handleNotificationClick(notification: ApiNotification) {
    try {
      await markNotificationsRead(notification.id)
      setNotifications((items) =>
        items.map((item) => (item.id === notification.id ? { ...item, read: true, readAt: new Date().toISOString() } : item))
      )
      setUnreadCount((count) => Math.max(0, count - 1))
    } catch {
    }

    if (notification.link) {
      router.push(notification.link)
      setIsNotificationsOpen(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 sm:ml-4">
              <Image
                src="/images/sabba.svg"
                alt="Saba Text Logo"
                width={180}
                height={63}
                className="h-10 w-auto sm:h-12"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#800020] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 min-w-0">
              <Link href="/buyer-dashboard?tab=wishlist" className="hidden sm:inline-flex p-2 hover:bg-gray-100 rounded-lg transition" aria-label="Wishlist">
                <Heart className="w-5 h-5 text-gray-700" />
              </Link>
              <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition relative" aria-label="Cart">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {isLoggedIn && (
                <div className="relative">
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="fixed right-2 left-2 top-16 sm:absolute sm:left-auto sm:top-auto sm:right-0 sm:mt-2 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b">
                        <p className="font-semibold text-gray-900">Notifications</p>
                        {unreadCount > 0 && (
                          <button
                            onClick={async () => {
                              await markNotificationsRead()
                              setNotifications((items) => items.map((item) => ({ ...item, read: true, readAt: new Date().toISOString() })))
                              setUnreadCount(0)
                            }}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-sm text-gray-600 text-center">No notifications yet.</p>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 ${
                                notification.read || notification.readAt ? "bg-white" : "bg-primary/5"
                              }`}
                            >
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {notification.message || notification.body}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conditional buttons based on login status */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#800020]/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#800020]" />
                      </div>
                      <div className="text-left hidden lg:block">
                        <p className="text-sm font-medium text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole.toLowerCase()}</p>
                      </div>
                    </button>
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        <button
                          onClick={handleProfileClick}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Profile
                        </button>
                        {userRole === "DESIGNER" && (
                          <Link
                            href="/seller-dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Seller Dashboard
                          </Link>
                        )}
                        {userRole !== "DESIGNER" && userRole !== "ADMIN" && (
                          <Link
                            href="/buyer-dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Buyer Dashboard
                          </Link>
                        )}
                        {userRole === "ADMIN" && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link href="/seller-login">
                    <Button
                      variant="outline"
                      className="hidden sm:inline-flex text-primary border-primary hover:bg-primary hover:text-white text-sm bg-transparent"
                    >
                      Are you a seller?
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="hidden sm:inline-flex text-primary text-sm"
                    >
                      Login / Register
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Shop Dropdown */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setIsShopOpen(!isShopOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isShopOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isShopOpen && (
                  <div className="pl-6 py-1 space-y-1 bg-gray-50">
                    <Link
                      href="/shop/all-products"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      All Products
                    </Link>
                    <Link
                      href="/shop/women-clothes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Women Clothes
                    </Link>
                    <Link
                      href="/shop/men-clothes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Men Clothes
                    </Link>
                    <Link
                      href="/shop/jewelry"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Jewelry
                    </Link>
                    <Link
                      href="/shop/gabi"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Gabi
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile Login/Seller buttons for non-logged in users */}
              {!isLoggedIn && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    href="/login"
                    className="block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                      Login / Register
                    </Button>
                  </Link>
                  <Link
                    href="/seller-login"
                    className="block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Are you a seller?
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile User info for logged in users */}
              {isLoggedIn && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-[#800020]/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#800020]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500 capitalize">{userRole.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => {
                        handleProfileClick()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      My Profile
                    </button>
                    {userRole === "DESIGNER" && (
                      <Link
                        href="/seller-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Seller Dashboard
                      </Link>
                    )}
                    {userRole !== "DESIGNER" && userRole !== "ADMIN" && (
                      <Link
                        href="/buyer-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Buyer Dashboard
                      </Link>
                    )}
                    {userRole === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </nav>
          )}
        </div>
      </header>

      {showPattern && (
        <div className="h-6 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 pattern-geometric"></div>
      )}
    </>
  )
}
