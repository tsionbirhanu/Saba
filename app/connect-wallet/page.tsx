"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  getAvailableWallets,
  connectWallet,
  getBech32RewardAddress,
} from "@/lib/cardano"

export default function ConnectWalletPage() {
  const [wallets, setWallets] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const email = localStorage.getItem("email") // saved after login/register

  useEffect(() => {
    setWallets(getAvailableWallets())
  }, [])

  const handleConnect = async (walletName: string) => {
    if (!email) {
      setMessage("Please login first")
      return
    }

    if (loading) return

    try {
      setLoading(true)
      setMessage("Connecting wallet...")

      // 1️⃣ Enable wallet
      const walletApi = await connectWallet(walletName)

      // 2️⃣ Get wallet address
      const walletAddress = await getBech32RewardAddress(walletApi)

      // 3️⃣ Request nonce
      const nonceRes = await fetch("/api/auth/seller/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const nonceData = await nonceRes.json()
      if (!nonceRes.ok) throw new Error(nonceData.error)

      // 4️⃣ Sign nonce
      const signed = await walletApi.signData(
        walletAddress,
        nonceData.nonce
      )

      // 5️⃣ Verify signature
      const verifyRes = await fetch("/api/auth/seller/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          signature: signed.signature,
          walletAddress,
        }),
      })

      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) throw new Error(verifyData.error)

      setMessage("✅ Wallet verified successfully!")
    } catch (err: any) {
      setMessage(err.message || "Wallet connection failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Connect Cardano Wallet</h1>

      {wallets.length === 0 && (
        <p className="text-sm text-gray-500">No wallets detected</p>
      )}

      {wallets.map((wallet) => (
        <Button
          key={wallet}
          type="button"
          disabled={loading}
          onClick={() => handleConnect(wallet)}
          className="w-full"
        >
          {loading ? "Connecting..." : `Connect ${wallet}`}
        </Button>
      ))}

      {message && <p className="text-sm text-center">{message}</p>}
    </div>
  )
}
