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
  const [userType, setUserType] = useState<"buyer" | "seller" | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    nationalId: "",
    businessName: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
    else handleComplete() // On step 5, complete registration
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  // Simulated registration completion
  const handleComplete = () => {
    // Here you could add actual API call to register user
    if (userType === "buyer") {
      router.push("/") // redirect buyers to home
    } else if (userType === "seller") {
      router.push("/seller-dashboard") // redirect sellers to dashboard
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
          {/* Header */}
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Welcome!</h1>
          <p className="text-center text-gray-600 text-sm mb-8">Let's set up your account</p>

          {/* Step Indicators */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((num) => (
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

          {/* Step 1: User Type */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-center text-gray-700 font-semibold mb-6">Are you a buyer or seller?</p>
              <button
                onClick={() => { setUserType("buyer"); handleNext() }}
                className="w-full p-4 border border-[#800020] rounded-lg hover:border-[#660018] hover:bg-[#ffe6e6] transition text-left font-semibold text-gray-900"
              >
                I'm a Buyer
              </button>
              <button
                onClick={() => { setUserType("seller"); handleNext() }}
                className="w-full p-4 border border-[#800020] rounded-lg hover:border-[#660018] hover:bg-[#ffe6e6] transition text-left font-semibold text-gray-900"
              >
                I'm a Seller
              </button>
            </div>
          )}

          {/* Step 2: Email */}
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

          {/* Step 3: Password */}
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

          {/* Step 4: Full Name or Business Name */}
          {step === 4 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                {userType === "seller" ? "Business Name" : "Full Name"}
              </label>
              <input
                type="text"
                name={userType === "seller" ? "businessName" : "fullName"}
                value={userType === "seller" ? formData.businessName : formData.fullName}
                onChange={handleInputChange}
                placeholder={userType === "seller" ? "Your business name" : "Your full name"}
                className="w-full px-4 py-3 border border-[#800020] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
              />
            </div>
          )}

          {/* Step 5: National ID for seller / Confirmation for buyer */}
          {step === 5 && (
            <div className="space-y-4">
              {userType === "seller" ? (
                <>
                  <label className="block text-sm font-semibold text-gray-700">National ID</label>
                  <input
                    type="text"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    placeholder="Enter your national ID"
                    className="w-full px-4 py-3 border border-[#800020] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                  />
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-700 font-semibold mb-4">Account created successfully!</p>
                  <p className="text-gray-600 text-sm">Welcome to Saba, {formData.fullName}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              onClick={handlePrev}
              disabled={step === 1}
              variant="outline"
              className="flex-1 py-3 bg-transparent border border-[#800020]"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-[#800020] hover:bg-[#660018] text-white py-3"
            >
              {step === 5 ? "Complete" : "Next"}
            </Button>
          </div>

          {/* Login Link */}
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
