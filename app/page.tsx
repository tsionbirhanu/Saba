import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
// import { ProductCarousel } from "@/components/product-carousel"
// import { FeaturedSection } from "@/components/featured-section"
import { BestsellerSection } from "@/components/bestseller-section"
// import { FeaturedPosts } from "@/components/featured-posts"
import { Footer } from "@/components/footer"

export default function Home() {
  const traditionalAttireProducts = [
    {
      id: "1",
      name: "Traditional Attire",
      category: "Explore Clothes",
      image: "/images/tr2.jpg",
      link: "#",
    },
    {
      id: "2",
      name: "Traditional Attire",
      category: "Explore Clothes",
      image: "/images/traditional.jpg",
      link: "#",
    },
    {
      id: "3",
      name: "Traditional Attire",
      category: "Explore Clothes",
      image: "/images/tr2.jpg",
      link: "#",
    },
    {
      id: "4",
      name: "Traditional Attire",
      category: "Explore Clothes",
      image: "/images/traditional.jpg",
      link: "#",
    },
  ]

  const featuredPosts = [
    {
      id: "1",
      title: "Loudest à la Madison #1 (L'intégral)",
      category: "Google",
      date: "22 April 2021",
      comments: 10,
      image: "/colorful-street.jpg",
      isNew: true,
    },
    {
      id: "2",
      title: "Loudest à la Madison #1 (L'intégral)",
      category: "Google",
      date: "22 April 2021",
      comments: 10,
      image: "/pink-car.jpg",
      isNew: true,
    },
    {
      id: "3",
      title: "Loudest à la Madison #1 (L'intégral)",
      category: "Google",
      date: "22 April 2021",
      comments: 10,
      image: "/colorful-umbrellas.jpg",
      isNew: true,
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />

      <BestsellerSection />
    


      <Footer />
    </main>
  )
}