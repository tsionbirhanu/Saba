import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
// ... other imports
import { WalletProvider } from '@/components/wallet-provider'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add this script for wallet detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Cardano wallet detection
              if (typeof window !== 'undefined') {
                window.detectedWallets = [];
                
                // Check for wallets on load
                function checkWallets() {
                  const wallets = ['nami', 'eternl', 'lace', 'flint', 'yoroi', 'gerowallet', 'typhon'];
                  wallets.forEach(wallet => {
                    if (window.cardano && window.cardano[wallet]) {
                      window.detectedWallets.push(wallet);
                    }
                  });
                  console.log('Detected wallets:', window.detectedWallets);
                }
                
                // Check immediately and after delay
                checkWallets();
                setTimeout(checkWallets, 1000);
                setTimeout(checkWallets, 3000);
              }
            `
          }}
        />
      </head>
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}