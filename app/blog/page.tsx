import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar, ArrowRight } from "lucide-react"

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Saba Blog</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Stories, insights, and updates from the Saba community
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-24 bg-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <div className="inline-block">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-lg text-gray-600 mb-8">
              We're working on bringing you inspiring stories from our artisans, fashion tips, cultural insights, and
              behind-the-scenes content. Stay tuned for our first blog posts!
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h3>
              <ul className="text-left space-y-3 max-w-md mx-auto">
                <li className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700">Artisan spotlights and success stories</span>
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700">Traditional craftsmanship guides</span>
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700">Fashion and styling tips</span>
                </li>
                <li className="flex items-center gap-3">
                  <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700">Cultural heritage and traditions</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-600">Subscribe to our newsletter to be notified when we launch our blog</p>
            <div className="flex gap-2 max-w-md mx-auto mt-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium">
                Notify Me
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
