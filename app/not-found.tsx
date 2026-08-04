import Link from "next/link";
import { SearchX } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
        <section className="max-w-lg text-center bg-white rounded-lg border border-gray-100 p-10 shadow-sm">
          <SearchX className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-sm font-semibold text-primary mb-2">404</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
          <p className="text-gray-600 mb-6">
            This page may have moved, or the product/designer may no longer be publicly listed.
          </p>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-white">Browse Shop</Button>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
