"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <section className="max-w-lg text-center bg-white rounded-lg border border-gray-100 p-10 shadow-sm">
            <p className="text-sm font-semibold text-[#800020] mb-2">500</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Saba needs a refresh</h1>
            <p className="text-gray-600 mb-6">A critical page error occurred.</p>
            <button
              onClick={reset}
              className="px-5 py-3 rounded-lg bg-[#800020] text-white font-medium hover:bg-[#660018]"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}
