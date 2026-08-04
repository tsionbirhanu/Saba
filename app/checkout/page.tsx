"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ApiCartResponse, checkout, getCart, getLoggedInUser } from "@/lib/api-client";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<ApiCartResponse | null>(null);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingNotes: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const [cartResponse, user] = await Promise.all([getCart(), getLoggedInUser()]);
        setCart(cartResponse);
        setForm((current) => ({
          ...current,
          contactName: user.name || "",
          contactEmail: user.email || "",
          contactPhone: user.phoneNumber || "",
        }));
      } catch {
        router.push("/login");
      }
    }

    load();
  }, [router]);

  const itemCount = useMemo(() => cart?.itemCount || 0, [cart]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await checkout(form);
      window.dispatchEvent(new Event("cart-updated"));
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        router.push(`/checkout/success?order=${response.order.id}`);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not place order.");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          {!cart ? (
            <div className="bg-white rounded-lg p-10 shadow-sm">Loading checkout...</div>
          ) : itemCount === 0 ? (
            <div className="bg-white rounded-lg p-10 shadow-sm text-center">Your cart is empty.</div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-gray-900">Contact and Shipping</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={form.contactName} onChange={(event) => setForm({ ...form, contactName: event.target.value })} placeholder="Full name" className="px-4 py-3 border rounded-lg" required />
                    <input value={form.contactEmail} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} placeholder="Email" type="email" className="px-4 py-3 border rounded-lg" required />
                    <input value={form.contactPhone} onChange={(event) => setForm({ ...form, contactPhone: event.target.value })} placeholder="Phone number" className="px-4 py-3 border rounded-lg" required />
                    <input value={form.shippingCity} onChange={(event) => setForm({ ...form, shippingCity: event.target.value })} placeholder="City" className="px-4 py-3 border rounded-lg" required />
                    <input value={form.shippingAddress} onChange={(event) => setForm({ ...form, shippingAddress: event.target.value })} placeholder="Shipping address" className="md:col-span-2 px-4 py-3 border rounded-lg" required />
                    <textarea value={form.shippingNotes} onChange={(event) => setForm({ ...form, shippingNotes: event.target.value })} placeholder="Delivery notes" className="md:col-span-2 px-4 py-3 border rounded-lg min-h-24" />
                  </div>
                </section>

                <section className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                  </div>
                  <p className="text-sm text-gray-600">
                    Secure payment is handled through Chapa hosted checkout before your order is confirmed.
                  </p>
                </section>
              </div>

              <aside className="bg-white rounded-lg p-6 shadow-sm h-fit">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cart.cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <Image src={item.product.image || "/images/dress.jpg"} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-600">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">Br {(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>Br {cart.subtotal.toLocaleString()}</span>
                </div>
                <Button disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white">
                  {isSubmitting ? "Placing order..." : "Place Order"}
                </Button>
                {status && <p className="mt-4 text-sm text-red-600">{status}</p>}
              </aside>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
