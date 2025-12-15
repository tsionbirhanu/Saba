import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BestsellerSection } from "@/components/bestseller-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <BestsellerSection />
      <Footer />
    </main>
  )
}