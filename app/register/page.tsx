"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<"BUYER" | "DESIGNER" | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step === 2 && !formData.email) {
      setStatusMessage("Please enter your email address.")
      return
    }
    if (step === 3) {
      if (formData.password.length < 6) {
        setStatusMessage("Password must be at least 6 characters.")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setStatusMessage("Passwords do not match.")
        return
      }
    }
    if (step === 4 && !formData.fullName) {
      setStatusMessage("Please enter your full name.")
      return
    }
    
    if (step < 4) {
      setStep(step + 1)
      setStatusMessage("")
    } else {
      handleRegister() 
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
      setStatusMessage("")
    }
  }

  const handleRegister = async () => {
    if (!userType) {
      setStatusMessage("Please select a user type.")
      return
    }

    setIsLoading(true)
    setStatusMessage("Creating your account...")

    const payload = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: userType, 
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        setStatusMessage("Account created successfully! Redirecting to login...")
        
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } else {
        setStatusMessage(`Registration failed: ${data.error || 'Server error'}`)
        setIsLoading(false)
      }
    } catch (error) {
      setStatusMessage("Network error. Please try again.")
      setIsLoading(false)
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
        <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Join Saba</h1>
          <p className="text-center text-gray-600 text-sm mb-8">Create your account in 4 simple steps</p>
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  num < step
                    ? "bg-gray-700 text-white"
                    : num === step
                      ? "bg-[#800020] text-white ring-2 ring-[#c04050]"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {num}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <p className="text-center text-gray-700 font-semibold mb-6">How will you use Saba?</p>
              <button
                onClick={() => { setUserType("BUYER"); handleNext() }}
                className="w-full p-6 border-2 border-[#800020] rounded-xl hover:border-[#660018] hover:bg-[#ffe6e6] transition text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">I&apos;m a Buyer</h3>
                    <p className="text-gray-600 text-sm mt-1">Shop authentic Ethiopian products</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => { setUserType("DESIGNER"); handleNext() }}
                className="w-full p-6 border-2 border-[#800020] rounded-xl hover:border-[#660018] hover:bg-[#ffe6e6] transition text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                    <span className="text-2xl">👩‍🎨</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">I&apos;m a Seller</h3>
                    <p className="text-gray-600 text-sm mt-1">Sell your designs & connect wallet for payments</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-[#800020] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
              />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Create Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-[#800020] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent mb-3"
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 border border-[#800020] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-[#800020] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
              />
            </div>
          )}

          {statusMessage && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${statusMessage.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {statusMessage}
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <Button
              onClick={handlePrev}
              disabled={step === 1 || isLoading}
              variant="outline"
              className="flex-1 py-3 bg-transparent border-gray-300"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 bg-[#800020] hover:bg-[#660018] text-white py-3"
            >
              {isLoading ? 'Processing...' : step === 4 ? "Complete Registration" : "Next"}
            </Button>
          </div>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#800020] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}