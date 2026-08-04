import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Store } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function SellerEntryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="relative min-h-80 sm:min-h-[420px] rounded-lg overflow-hidden bg-gray-100">
            <Image src="/images/tilet3.png" alt="Saba seller onboarding" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/35 flex items-end">
              <div className="p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-wide mb-2">Sell on Saba</p>
                <h1 className="text-2xl sm:text-4xl font-bold mb-3">Create your shop, then get verified.</h1>
                <p className="text-white/90">
                  Register normally, prepare your profile and products, then submit National ID for admin approval.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Store className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Seller access</h2>
                <p className="text-gray-600 text-sm">The safe marketplace flow for designers.</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "Create a normal seller account with email and password.",
                "Complete your designer profile and upload National ID in the dashboard.",
                "Admin approval unlocks public product listings and the verified badge.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/register?role=DESIGNER">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Register as seller
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full bg-transparent">
                  Seller login
                </Button>
              </Link>
            </div>

            <div className="mt-6 rounded-lg bg-amber-50 border border-amber-100 p-4 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-900">
                Products from unverified sellers stay hidden from buyers until admin approval.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
