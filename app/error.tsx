"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <section className="max-w-lg text-center bg-white rounded-lg border border-gray-100 p-10 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-primary mx-auto mb-4" />
        <p className="text-sm font-semibold text-primary mb-2">500</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-600 mb-6">We could not load this part of Saba. Try again or return to the shop.</p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset} className="bg-primary hover:bg-primary/90 text-white">
            Try again
          </Button>
          <Link href="/shop">
            <Button variant="outline" className="bg-transparent">
              Shop
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
