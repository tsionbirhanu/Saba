"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, AlertCircle, Wallet, User } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [walletConflict, setWalletConflict] = useState<{
    show: boolean
    message: string
    otherEmail?: string
  }>({ show: false, message: "" })

  const handleLogin = async () => {
    if (!email || !password) {
      setStatusMessage("Please enter both email and password.")
      return
    }

    setIsLoading(true)
    setStatusMessage("")
    setWalletConflict({ show: false, message: "" })

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("email", email)

      setStatusMessage("Login successful! Checking wallet status...")

      if (data.user.role === "DESIGNER") {
        await handleDesignerLogin(data.token, data.user)
      } else {
        router.push("/")
      }

    } catch (error: any) {
      setStatusMessage(error.message || "Login failed. Please check your credentials.")
      setIsLoading(false)
    }
  }

  const handleDesignerLogin = async (token: string, user: any) => {
    try {
      if (user.walletVerified && user.cardanoAddress) {
        router.push("/seller-dashboard")
        return
      }
      const walletRes = await fetch("/api/auth/seller/wallet-status", {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (walletRes.ok) {
        const walletData = await walletRes.json()
        
        if (walletData.status === "connected_to_other") {
          setWalletConflict({
            show: true,
            message: `Your Cardano wallet is already connected to another Saba account.`,
            otherEmail: walletData.connectedToUser?.email
          })
          
          setStatusMessage("")
          setIsLoading(false)
          return
        }
      }

      router.push("/connect-wallet")

    } catch (error) {
      console.error("Wallet check error:", error)
      router.push("/connect-wallet")
    }
  }

  const handleContinueAnyway = () => {
    setWalletConflict({ show: false, message: "" })
    router.push("/connect-wallet")
  }

  const handleUseDifferentAccount = () => {
    if (walletConflict.otherEmail) {
      setEmail(walletConflict.otherEmail)
      setPassword("")
      setWalletConflict({ show: false, message: "" })
      setStatusMessage(`Please enter password for ${walletConflict.otherEmail}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.jpg"
          alt="Background"
          fill
          className="object-cover blur-md"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Saba</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {walletConflict.show && (
              <div className="mb-6 animate-fade-in">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 mb-2">
                        ⚠️ Wallet Already Connected
                      </p>
                      <p className="text-sm text-yellow-700 mb-3">
                        {walletConflict.message}
                      </p>
                      
                      {walletConflict.otherEmail && (
                        <div className="mb-3 p-3 bg-yellow-100 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-yellow-700" />
                            <p className="text-sm font-medium text-yellow-800">Connected to:</p>
                          </div>
                          <p className="text-sm text-yellow-900 font-mono">
                            {walletConflict.otherEmail}
                          </p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <p className="text-xs text-yellow-700 font-medium">What would you like to do?</p>
                        <div className="flex flex-col gap-2">
                          {walletConflict.otherEmail && (
                            <Button
                              onClick={handleUseDifferentAccount}
                              variant="outline"
                              className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 text-sm"
                            >
                              Login to {walletConflict.otherEmail}
                            </Button>
                          )}
                          <Button
                            onClick={handleContinueAnyway}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm"
                          >
                            Continue Anyway (Connect Different Wallet)
                          </Button>
                          <Button
                            onClick={() => setWalletConflict({ show: false, message: "" })}
                            variant="ghost"
                            className="w-full text-gray-600 hover:text-gray-900 text-sm"
                          >
                            Go Back
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Wallet className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-blue-800">Note:</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Each Cardano wallet can only be connected to one Saba account for security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!walletConflict.show && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent transition"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link 
                      href="/forgot-password" 
                      className="text-xs text-[#800020] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent pr-10 transition"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                {statusMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    statusMessage.includes('successful') 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {statusMessage.includes('successful') ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      <span>{statusMessage}</span>
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-[#800020] hover:bg-[#660018] text-white py-3 rounded-lg font-semibold text-base transition shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500">New to Saba?</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link 
                      href="/register" 
                      className="text-[#800020] font-semibold hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    <span className="font-medium">Designers:</span> You&apos;ll need to connect a Cardano wallet after login
                    <br/>
                    <span className="font-medium">Buyers:</span> Direct access to shopping
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Having trouble?{" "}
                  <button
                    onClick={() => {
                      setStatusMessage("For wallet issues: 1) Make sure your wallet is unlocked 2) Try a different browser 3) Contact support")
                    }}
                    className="text-[#800020] hover:underline font-medium"
                  >
                    Get help
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}