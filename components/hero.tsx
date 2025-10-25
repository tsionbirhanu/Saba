"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Hero() {
  const slides = [
    {
      title: "Every Piece Tells Her Story",
      description:
        "Explore authentic handmade textiles and wearable art crafted by women artisans — empowering their dreams with every purchase.",
      image: "/images/tilet2.png",
      textColor: "text-black",
      descColor: "text-gray-800",
    },
    {
      title: "Empower Women Artisans",
      description:
        "Support local women entrepreneurs and discover unique handcrafted products that celebrate cultural heritage.",
      image: "/images/tilet3.png",
      textColor: "text-white",
      descColor: "text-gray-100",
    },
  ]

  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [autoPlay, slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 5000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 5000)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setAutoPlay(false)
    setTimeout(() => setAutoPlay(true), 5000)
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover object-[center_top_20%] w-full h-full"
          />
        </div>
      ))}

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-20 md:mt-28">
        <h1
          className={`text-4xl md:text-6xl font-bold leading-tight mb-4 animate-fade-in ${slides[currentSlide].textColor}`}
        >
          {slides[currentSlide].title}
        </h1>
        <p
          className={`text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-8 animate-fade-in ${slides[currentSlide].descColor}`}
        >
          {slides[currentSlide].description}
        </p>
        <Button
          size="lg"
          className="bg-[#852221] hover:bg-[#b14442] text-black rounded-full px-8 py-6 text-lg font-semibold shadow-lg transition"
        >
          Start Now
        </Button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white hover:scale-110 transition-transform"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white hover:scale-110 transition-transform"
      >
        <ChevronRight className="w-10 h-10" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-gray-400 hover:bg-gray-300 w-2"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
