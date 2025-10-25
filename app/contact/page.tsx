import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 py-20 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We&apos;re here to help and answer any question you might have. Reach out to our team anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              {/* Contact Info Cards */}
              <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-8 border border-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                    <p className="text-gray-600 mb-1">+251 911 121 314</p>
                    <p className="text-gray-600">+251 911 121 315</p>
                    <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent/5 to-transparent rounded-xl p-8 border border-accent/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-600 mb-1">hello@saba.com</p>
                    <p className="text-gray-600">support@saba.com</p>
                    <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-xl p-8 border border-primary/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-600 mb-1">Addis Ababa, Ethiopia</p>
                    <p className="text-gray-600">East Africa</p>
                    <p className="text-sm text-gray-500 mt-2">Visit our showroom</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition font-semibold flex items-center justify-center gap-2 group"
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition" />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Business Hours & Additional Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Business Information</h2>

                <div className="bg-gray-50 rounded-xl p-8 mb-6">
                  <div className="flex items-start gap-4 mb-6">
                    <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Business Hours</h3>
                      <div className="space-y-2 text-gray-600">
                        <p>
                          <span className="font-medium">Monday - Friday:</span> 9:00 AM - 6:00 PM
                        </p>
                        <p>
                          <span className="font-medium">Saturday:</span> 10:00 AM - 4:00 PM
                        </p>
                        <p>
                          <span className="font-medium">Sunday:</span> Closed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-xl p-8 border border-primary/10">
                  <h3 className="font-semibold text-gray-900 mb-4">Why Choose Saba?</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Authentic handcrafted products from local artisans</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Premium quality and sustainable materials</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Fast and reliable shipping worldwide</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Dedicated customer support team</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
