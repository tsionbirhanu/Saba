import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { CheckCircle, Users, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-brown py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Saba</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Empowering women artisans by connecting them with customers who value authentic, handmade products
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Saba is dedicated to creating economic opportunities for women artisans across Ethiopia and beyond. We
                  believe that traditional craftsmanship deserves recognition and fair compensation in the modern
                  marketplace.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our platform provides a direct channel between talented women creators and global customers,
                  eliminating unnecessary intermediaries and ensuring that artisans receive fair value for their
                  exceptional work.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-gray-700">Fair pricing for artisans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-gray-700">Authentic handmade products</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="text-gray-700">Global market access</span>
                  </div>
                </div>
              </div>
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src="/images/tMr7ouLI.jpg"
                  alt="Women artisans"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: Users,
                  title: "Community",
                  description: "We support and celebrate the women artisans who create our products",
                },
                {
                  icon: Award,
                  title: "Quality",
                  description: "Every product meets our high standards for craftsmanship and authenticity",
                },
                {
                  icon: Globe,
                  title: "Sustainability",
                  description: "We promote ethical practices and environmental responsibility",
                },
                {
                  icon: CheckCircle,
                  title: "Transparency",
                  description: "We believe in honest communication with both artisans and customers",
                },
              ].map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="bg-white p-6 rounded-lg text-center">
                    <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {[
                { number: "500+", label: "Women Artisans" },
                { number: "5000+", label: "Products" },
                { number: "50K+", label: "Happy Customers" },
                { number: "25+", label: "Countries Served" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-primary-foreground/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Abeba Tekle",
                  role: "Founder & CEO",
                  image: "/images/girl1.png",
                },
                {
                  name: "Marta Assefa",
                  role: "Head of Artisan Relations",
                  image: "/images/girl2.png",
                },
                {
                  name: "Melat Kebede",
                  role: "Operations Director",
                  image: "/images/girl1.png ",
                },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
