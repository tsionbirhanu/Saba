"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Loader2, 
  Wallet, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Download,
  ExternalLink,
  RefreshCw,
  Lock,
} from "lucide-react"

export default function ConnectWalletPage() {
  const router = useRouter()
  
  const [detectedWallets, setDetectedWallets] = useState<string[]>([])
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"select" | "connect" | "sign" | "success">("select")
  const [status, setStatus] = useState("Select a wallet to connect")
  const [connectedAddress, setConnectedAddress] = useState("")
  const [connectionError, setConnectionError] = useState("")
  const [isWalletLocked, setIsWalletLocked] = useState(false)

  useEffect(() => {
    const checkWallets = () => {
      if (typeof window === 'undefined') return
      
      const wallets: string[] = []
      const walletList = ['nami', 'eternl', 'lace', 'flint', 'yoroi', 'gerowallet', 'typhon']
      
      walletList.forEach(wallet => {
        if (window.cardano && window.cardano[wallet]) {
          wallets.push(wallet)
        }
      })
      
      setDetectedWallets(wallets)
      console.log('📱 Detected wallets:', wallets)
      
      if (wallets.length > 0 && !selectedWallet) {
        setSelectedWallet(wallets[0])
        setStatus(`Selected ${getWalletName(wallets[0])}. Click "Connect Wallet"`)
      }
    }
    
    checkWallets()
    const interval = setInterval(checkWallets, 2000)
    return () => clearInterval(interval)
  }, [selectedWallet])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    
    if (!token || !userStr) {
      router.push("/login")
      return
    }
    
    const user = JSON.parse(userStr)
    if (user.role !== "DESIGNER") {
      router.push("/")
      return
    }
    
    if (user.walletVerified) {
      router.push("/seller-dashboard")
    }
  }, [router])

 
  const stringToHex = (str: string): string => {
    return Array.from(str).map(c => 
      c.charCodeAt(0).toString(16).padStart(2, '0')
    ).join('')
  }

  const getWalletName = (walletId: string): string => {
    const names: Record<string, string> = {
      nami: 'Nami Wallet',
      eternl: 'Eternl Wallet',
      lace: 'Lace Wallet',
      flint: 'Flint Wallet',
      yoroi: 'Yoroi Wallet',
      gerowallet: 'Gero Wallet',
      typhon: 'Typhon Wallet'
    }
    return names[walletId] || walletId
  }

  const getWalletIcon = (walletId: string): string => {
    const icons: Record<string, string> = {
      nami: '🦊',
      eternl: '🌐',
      lace: '🎀',
      flint: '🔥',
      yoroi: '👘',
      gerowallet: '⚡',
      typhon: '🌀'
    }
    return icons[walletId] || '👛'
  }

  const handleConnectWallet = async () => {
    if (!selectedWallet || !window.cardano?.[selectedWallet]) {
      setConnectionError("Wallet not found. Please refresh the page.")
      setStatus("❌ Wallet not found")
      return
    }

    setIsLoading(true)
    setStep("connect")
    setStatus("Connecting to wallet...")
    setConnectionError("")
    setIsWalletLocked(false)

    try {
      const connectionPromise = window.cardano[selectedWallet].enable()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout (10s)')), 10000)
      )
      
      const api = await Promise.race([connectionPromise, timeoutPromise])
      
      let address = ""
      
     
      if (api.getChangeAddress) {
        address = await api.getChangeAddress()
      } else if (api.getUsedAddresses) {
        const addresses = await api.getUsedAddresses()
        address = addresses[0]
      } else if (api.getUnusedAddresses) {
        const addresses = await api.getUnusedAddresses()
        address = addresses[0]
      } else if (api.getAddresses) {
        const addresses = await api.getAddresses()
        address = addresses[0]
      } else if (api.getRewardAddresses) {
        const addresses = await api.getRewardAddresses()
        address = addresses[0]
      }

      if (!address) {
        throw new Error("Could not get wallet address")
      }

      console.log("✅ Wallet connected. Address:", address.substring(0, 20) + "...")
      
      setConnectedAddress(address)
      setStatus(`✅ Connected! Address: ${address.substring(0, 10)}...`)
      setStep("sign")
      
      setTimeout(() => {
        handleSignMessage(api, address)
      }, 1000)

    } catch (error: any) {
      console.error("❌ Connection error:", error)
      
      // Check if wallet is locked
      if (error.message.includes("rejected") || error.message.includes("locked") || error.message.includes("not enabled")) {
        setIsWalletLocked(true)
        setConnectionError("Wallet is locked. Please unlock it and try again.")
        setStatus("❌ Wallet is locked")
      } else {
        setConnectionError(error.message || "Connection failed")
        setStatus(`❌ ${error.message || "Connection failed"}`)
      }
      
      setIsLoading(false)
      setStep("select")
    }
  }

  const handleSignMessage = async (api: any, address: string) => {
    setStatus("Requesting verification challenge...")
    setConnectionError("")
    
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Session expired. Please login again.")

      // Get nonce from backend
      const nonceRes = await fetch("/api/auth/seller/nonce", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!nonceRes.ok) {
        const errorData = await nonceRes.json()
        throw new Error(errorData.error || "Failed to get challenge")
      }
      
      const { nonce, hexNonce } = await nonceRes.json()
      
      console.log("📝 Received nonce. Hex version available:", !!hexNonce)
      
      setStatus("Please sign the message in your wallet popup...")

      
      let signatureData
      
      try {
        if (api.signData) {
          const messageToSign = hexNonce || stringToHex(nonce)
          console.log("Signing with:", selectedWallet === 'lace' ? 'hex nonce' : 'text nonce')
          
          signatureData = await api.signData(address, messageToSign)
        } else {
          throw new Error("This wallet doesn't support message signing")
        }
      } catch (signError: any) {
        console.error("❌ Signing error:", signError)
        
        
        try {
          const alternativeMessage = selectedWallet === 'lace' ? nonce : stringToHex(nonce)
          console.log("Retrying with alternative encoding...")
          signatureData = await api.signData(address, alternativeMessage)
        } catch (retryError: any) {
          throw new Error(`Signing failed: ${retryError.message}`)
        }
      }

      if (!signatureData || !signatureData.signature) {
        throw new Error("No signature received from wallet")
      }

      console.log("✅ Signature received. Length:", signatureData.signature.length)

      setStatus("Verifying signature...")
      
      const verifyRes = await fetch("/api/auth/seller/verify", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          signature: signatureData.signature,
          walletAddress: address,
          key: signatureData.key,
          hexNonce: hexNonce || stringToHex(nonce),
          walletType: selectedWallet
        })
      })

      const responseData = await verifyRes.json()
      
      if (!verifyRes.ok) {
        console.error("❌ Verification API error:", responseData)
        throw new Error(responseData.error || "Verification failed")
      }

      setStatus("✅ Wallet verified successfully!")
      setStep("success")
      

      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        user.walletVerified = true
        user.cardanoAddress = address
        if (user.designerProfile) {
          user.designerProfile.walletVerified = true
          user.designerProfile.walletAddress = address
        }
        localStorage.setItem("user", JSON.stringify(user))
      }

      setTimeout(() => {
        router.push("/seller-dashboard")
      }, 2000)

    } catch (error: any) {
      console.error("❌ Signing/verification error:", error)
      setConnectionError(error.message)
      setStatus(`❌ ${error.message || "Verification failed"}`)
      setStep("select")
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push("/seller-dashboard")
  }

  const refreshWallets = () => {
    const wallets: string[] = []
    const walletList = ['nami', 'eternl', 'lace', 'flint', 'yoroi', 'gerowallet', 'typhon']
    
    if (typeof window !== 'undefined' && window.cardano) {
      walletList.forEach(wallet => {
        if (window.cardano[wallet]) {
          wallets.push(wallet)
        }
      })
    }
    
    setDetectedWallets(wallets)
    setStatus(wallets.length > 0 ? "Wallets refreshed" : "No wallets found")
  }

  const WalletButton = ({ walletId }: { walletId: string }) => (
    <button
      onClick={() => {
        setSelectedWallet(walletId)
        setStatus(`Selected ${getWalletName(walletId)}. Click "Connect Wallet"`)
        setConnectionError("")
      }}
      disabled={isLoading}
      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
        selectedWallet === walletId
          ? "border-[#800020] bg-red-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <span className="text-2xl">{getWalletIcon(walletId)}</span>
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-gray-900">{getWalletName(walletId)}</h3>
        <p className="text-sm text-gray-500">
          {selectedWallet === walletId ? "Selected ✓" : "Click to select"}
        </p>
      </div>
      {selectedWallet === walletId && (
        <CheckCircle className="w-5 h-5 text-green-500" />
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-50 to-orange-50 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-[#800020]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === "success" ? "Success! 🎉" : "Connect Cardano Wallet"}
            </h1>
            <p className="text-gray-600">
              {step === "success" 
                ? "Your wallet is now verified!" 
                : "Required for seller verification & payments"}
            </p>
          </div>

          
          {isWalletLocked && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Wallet is Locked</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    1. Click the Lace extension icon<br/>
                    2. Enter your password to unlock<br/>
                    3. Refresh this page and try again
                  </p>
                </div>
              </div>
            </div>
          )}

          
          {connectionError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-xs text-red-700 mt-1">{connectionError}</p>
                </div>
              </div>
            </div>
          )}

         
          <div className="flex justify-center mb-8">
            <div className="flex items-center">
              {["Select", "Connect", "Verify"].map((label, index) => (
                <div key={label} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    (step === "select" && index === 0) ||
                    (step === "connect" && index <= 1) ||
                    (step === "sign" && index <= 2) ||
                    (step === "success")
                      ? "bg-[#800020] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {index + 1}
                  </div>
                  {index < 2 && (
                    <div className={`w-12 h-1 ${
                      (step === "connect" && index === 0) ||
                      (step === "sign" && index <= 1) ||
                      (step === "success")
                        ? "bg-[#800020]"
                        : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

         
          {status && (
            <div className={`mb-6 p-4 rounded-lg border ${
              status.includes('✅') || status.includes('Success')
                ? "bg-green-50 border-green-200 text-green-800"
                : status.includes('❌')
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}>
              <div className="flex items-center gap-3">
                {status.includes('✅') || status.includes('Success') ? (
                  <CheckCircle className="w-5 h-5" />
                ) : status.includes('❌') ? (
                  <AlertCircle className="w-5 h-5" />
                ) : isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                <p className="text-sm font-medium">{status}</p>
              </div>
            </div>
          )}

          {step === "select" && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-700">Available Wallets</h2>
                  <button
                    onClick={refreshWallets}
                    className="text-sm text-[#800020] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                  </button>
                </div>

                {detectedWallets.length === 0 ? (
                  <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-xl">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">No Wallets Found</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Install a Cardano wallet extension to continue.
                    </p>
                    <div className="space-y-3">
                      <a
                        href="https://chrome.google.com/webstore/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 w-full"
                      >
                        <Download className="w-4 h-4" />
                        Install Lace Wallet
                      </a>
                      <p className="text-xs text-gray-500">
                        After installing, refresh this page and unlock the wallet
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detectedWallets.map(walletId => (
                      <WalletButton key={walletId} walletId={walletId} />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleConnectWallet}
                  disabled={!selectedWallet || isLoading || detectedWallets.length === 0}
                  className="w-full bg-[#800020] hover:bg-[#660018] text-white py-3 rounded-xl font-semibold"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </span>
                  ) : (
                    "Connect Wallet"
                  )}
                </Button>

                {process.env.NODE_ENV === 'development' && (
                  <Button
                    onClick={() => {
                      const userStr = localStorage.getItem("user")
                      if (userStr) {
                        const user = JSON.parse(userStr)
                        user.walletVerified = true
                        user.cardanoAddress = "addr1qy8xp5r0aw5w0a5nyea36l6pp72ucw48h9908h6wdqhjv5peg9j4xhyrmh3az8x2m5tgrpre7n6zk5xrgah8rnd86jss8j7p0d"
                        localStorage.setItem("user", JSON.stringify(user))
                      }
                      router.push("/seller-dashboard")
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                  >
                    🧪 Test Mode: Skip Wallet Connection
                  </Button>
                )}

                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Skip for Now (Limited Access)
                </Button>
              </div>
            </>
          )}

          {step === "sign" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verify Ownership</h3>
              <p className="text-gray-600 text-sm mb-4">
                A popup will appear from your wallet. Please sign the message to verify you own this wallet.
              </p>
              
              {selectedWallet === 'lace' && (
                <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-sm">🎀</span>
                    </div>
                    <p className="text-sm font-medium text-purple-800">Using Lace Wallet</p>
                  </div>
                  <p className="text-xs text-purple-700">
                    Make sure to approve the signing request in the Lace popup.
                  </p>
                </div>
              )}
              
              <div className="mb-6 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Wallet Address:</p>
                <p className="text-xs font-mono text-gray-800 break-all">
                  {connectedAddress}
                </p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setStep("select")
                    setIsLoading(false)
                  }}
                  variant="outline"
                  className="w-full border-gray-300"
                >
                  Try Different Wallet
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  className="w-full text-gray-600"
                >
                  Skip Verification
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Wallet Verified! 🎉</h3>
              <p className="text-gray-600 text-sm mb-6">
                Your Cardano wallet is now connected and verified.
                You can now receive payments for your sales.
              </p>
              
              <div className="mb-6 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Connected Address:</p>
                <p className="text-xs font-mono text-gray-800 break-all">
                  {connectedAddress}
                </p>
              </div>
              
              <div className="animate-pulse text-sm text-gray-500">
                Redirecting to dashboard...
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                <span className="font-medium">Need help with Lace Wallet?</span>
                <ExternalLink className="w-4 h-4 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="mt-3 text-xs text-gray-500 space-y-3">
                <div>
                  <p className="font-medium mb-1">Step-by-step guide:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Click the Lace extension icon in your browser toolbar</li>
                    <li>Enter your password to unlock the wallet</li>
                    <li>Refresh this page</li>
                    <li>Click &quot;Connect Wallet&quot; above</li>
                    <li>Approve the connection request in the Lace popup</li>
                    <li>Approve the signing request when prompted</li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium mb-1">Troubleshooting:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Make sure Lace is unlocked (green dot = unlocked)</li>
                    <li>Allow popups for this website</li>
                    <li>Try disconnecting and reconnecting</li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}