"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function SellerProfileSetupPage() {
  const [step, setStep] = useState(1)

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
        {/* --- Welcome Section --- */}
        <section className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-10 mb-16">
          {/* Left side: text overlay on image */}
          <div className="relative w-full md:w-1/2">
            <div className="bg-gray-200 rounded-2xl h-72 flex items-center justify-center overflow-hidden">
              {/* Replace this div with your <img src="..." /> */}
              <p className="text-gray-500 italic"><img src="/images/tilet3.png" /> </p>
            </div>

            {/* Overlay text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-2xl text-white text-center p-6">
              <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
              <p className="text-lg font-light">Let’s set up your profile</p>
            </div>
          </div>

          {/* Right side: Step Progress Indicator */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="flex items-center justify-between w-full max-w-sm mb-10">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step >= num
                        ? "bg-primary border-primary text-white"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {step > num ? <Check className="w-5 h-5" /> : num}
                  </div>
                  {num < 3 && (
                    <div
                      className={`h-1 w-16 md:w-20 transition-all duration-300 ${
                        step > num ? "bg-primary" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Cards */}
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md transition-all duration-500">
              {step === 1 && (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">Step 1: Business Info</h2>
                  <input
                    type="text"
                    placeholder="Business Name"
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Business Type"
                    className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  <Button className="w-full" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">Step 2: Contact Details</h2>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button onClick={nextStep}>Next</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">Step 3: Verification</h2>
                  <input
                    type="text"
                    placeholder="National ID"
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  <input
                    type="file"
                    className="w-full mb-6 border border-gray-300 rounded-lg py-2 px-2 text-sm"
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button>Finish Setup</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
