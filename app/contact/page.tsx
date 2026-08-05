import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import { Clock, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Store } from "lucide-react";

const contactCards = [
  {
    title: "Customer Support",
    description: "Questions about orders, favorites, checkout, or product details.",
    icon: MessageCircle,
  },
  {
    title: "Seller Help",
    description: "Support for designer registration, verification, products, and order fulfillment.",
    icon: Store,
  },
  {
    title: "Trust & Safety",
    description: "Report suspicious listings, account issues, or marketplace safety concerns.",
    icon: ShieldCheck,
  },
];

export default function ContactPage() {
  return (
    <>
      <Header showPattern={false} />
      <main className="min-h-screen bg-gray-50">
        <section className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Contact Saba</p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-950 sm:text-5xl">
                Support for buyers, sellers, and marketplace partners.
              </h1>
              <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
                Need help with an order, designer verification, a product listing, or a partnership? Send one clear
                message and the Saba team will receive it directly in Telegram.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {contactCards.map((card) => (
              <div key={card.title} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <card.icon className="h-7 w-7 text-primary" />
                <h2 className="mt-4 font-semibold text-gray-950">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-950">Send a Message</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Include your order ID or seller email if your message is about an existing account.
                </p>
              </div>
              <ContactForm />
            </div>

            <aside className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="text-lg font-bold text-gray-950">Contact Details</h2>
                <div className="mt-5 space-y-4 text-sm text-gray-700">
                  <p className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-primary" />
                    <span>
                      <span className="block font-medium text-gray-950">Phone</span>
                      +251 911 121 314
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-primary" />
                    <span>
                      <span className="block font-medium text-gray-950">Email</span>
                      hello@saba.com
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                    <span>
                      <span className="block font-medium text-gray-950">Location</span>
                      Addis Ababa, Ethiopia
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-primary p-6 text-primary-foreground shadow-sm">
                <Clock className="h-6 w-6 text-accent" />
                <h2 className="mt-4 text-lg font-bold">Support Hours</h2>
                <div className="mt-4 space-y-2 text-sm text-primary-foreground/85">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="font-semibold text-gray-950">Before you message us</h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-600">
                  <li>For order support, include the order date or product name.</li>
                  <li>For seller verification, include the email used during registration.</li>
                  <li>For product issues, share the product link if available.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
