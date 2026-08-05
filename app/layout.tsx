import type React from "react"
import type { Metadata } from "next"
import { AiStyleAssistant } from "@/components/ai-style-assistant"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Saba Marketplace",
    template: "%s | Saba Marketplace",
  },
  description: "Shop authentic Ethiopian fashion, gabi, jewelry, and handmade products from verified designers.",
  openGraph: {
    title: "Saba Marketplace",
    description: "Shop authentic Ethiopian fashion and handmade products from verified designers.",
    siteName: "Saba Marketplace",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <AiStyleAssistant />
      </body>
    </html>
  )
}
