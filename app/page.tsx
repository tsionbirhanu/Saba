import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BestsellerSection } from "@/components/bestseller-section"
import { Footer } from "@/components/footer"
import { getProducts } from "@/lib/api-client"

export default async function Home() {
  const [featuredProducts, popularProducts] = await Promise.all([
    getProducts({ sort: "newest" }).then((products) => products.slice(0, 6)).catch(() => []),
    getProducts({ sort: "popular" }).then((products) => products.slice(0, 6)).catch(() => []),
  ])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <BestsellerSection featuredProducts={featuredProducts} popularProducts={popularProducts} />
      <Footer />
    </main>
  )
}
