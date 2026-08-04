import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-10 shadow-sm text-center max-w-md w-full">
          <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order placed</h1>
          <p className="text-gray-600 mb-6">Your order is saved and your dashboard will show the latest status.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/buyer-dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white">View Orders</Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" className="bg-transparent">Keep Shopping</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
