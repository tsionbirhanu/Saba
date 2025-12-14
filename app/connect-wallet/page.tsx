"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button" // Assuming this is your ShadCN button
import { connectWallet, signMessage, getAvailableWallets } from "@/lib/cardano" 
import { Loader2, Zap } from "lucide-react"

export default function ConnectWalletPage() {
    const router = useRouter()
    const [availableWallets, setAvailableWallets] = useState<any[]>([])
    const [selectedWalletName, setSelectedWalletName] = useState("")
    const [statusMessage, setStatusMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [nonce, setNonce] = useState<string | null>(null)
    const [nonceFetchFailed, setNonceFetchFailed] = useState(false) // Prevents continuous re-fetching on error

    // --- 1. Load Available Wallets on Mount ---
    useEffect(() => {
        const loadWallets = () => {
            const wallets = getAvailableWallets().map(w => ({
                ...w,
                display: w.name || w.icon.split('/').pop()?.split('.')[0] || 'Unknown Wallet'
            }))
            setAvailableWallets(wallets)
            if (wallets.length > 0) {
                // Assuming the user wants to connect the first available wallet by default
                setSelectedWalletName(wallets[0].name.toLowerCase()) 
            }
        }
        
        const timeoutId = setTimeout(loadWallets, 500)
        return () => clearTimeout(timeoutId)
    }, [])

    // --- 2. Fetch Nonce (Signing Challenge) ---
    const fetchNonce = async () => {
        setIsLoading(true)
        setStatusMessage("Fetching security challenge...")
        
        const userEmail = localStorage.getItem("email");
        if (!userEmail) {
            setStatusMessage("Error: User email not found in session. Please re-login.");
            setIsLoading(false);
            setNonceFetchFailed(true);
            return null;
        }
        
        try {
            const res = await fetch("/api/auth/seller/nonce", { 
                method: "POST", 
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-Email': userEmail 
                },
            })

            const data = await res.json()

            if (!res.ok) {
                const errorMsg = data.error || 'Server error.';
                setStatusMessage(`Error fetching nonce: ${errorMsg}`);
                
                if (res.status === 401 || res.status === 403 || res.status === 500) {
                    setNonceFetchFailed(true); 
                }
                
                setIsLoading(false)
                return null
            }

            // FIX: Reset loading state on successful nonce fetch
            setIsLoading(false) 

            setNonce(data.nonce)
            setStatusMessage("Challenge loaded. Ready to connect wallet.")
            return data.nonce

        } catch (error) {
            console.error("Nonce fetch failed:", error)
            setStatusMessage("Failed to communicate with the server to get a security challenge. Check server logs.")
            setIsLoading(false)
            setNonceFetchFailed(true);
            return null
        }
    }

    // --- 3. Connect Wallet ---
    const handleConnect = async () => {
        if (!selectedWalletName) {
            setStatusMessage("Please select a wallet first.")
            return
        }
        
        setIsLoading(true)
        setStatusMessage(`Connecting to ${selectedWalletName}...`)

        // Ensure nonce is available before connecting/signing
        const currentNonce = nonce || await fetchNonce();
        if (!currentNonce) {
             setIsLoading(false);
             return; // Stop if nonce cannot be fetched
        }

        const connectedApi = await connectWallet(selectedWalletName);
        
        if (connectedApi) {
            // Success: proceed to sign
            await handleSignAndVerify(connectedApi); 
        } else {
            // Failure: connection rejected/failed
            setStatusMessage(`Failed to connect or connection rejected by ${selectedWalletName}.`)
            setIsLoading(false)
        }
    }

    // --- 4. Sign Message and Verify ---
    const handleSignAndVerify = async (api: any) => {
        // currentNonce is guaranteed to be set here
        const currentNonce = nonce!; 
        
        setStatusMessage("Please approve the signature request in your wallet app...")
        
        alert("Please approve the signature request in your wallet pop-up to authenticate your ownership of the address.")
        
        const signatureData = await signMessage(api, currentNonce);

        if (!signatureData) {
            // Failure captured in lib/cardano.ts (user rejection/no address)
            setStatusMessage("❌ Signature failed or was rejected by the user. Please try again.")
            setIsLoading(false)
            return
        }

        setStatusMessage("Signature received. Verifying on server...")
        
        const { signature, address } = signatureData;
        
        // Final verification request
        try {
            const userEmail = localStorage.getItem("email");

            const verifyRes = await fetch("/api/auth/seller/verify", { 
                method: "POST", 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: userEmail,
                    signature, 
                    walletAddress: address,
                }),
            });

            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
                setStatusMessage("✅ Wallet successfully connected and verified! Redirecting...")
                setTimeout(() => {
                    router.push("/dashboard") 
                }, 1500)
            } else {
                setStatusMessage(`Verification failed: ${verifyData.error || 'Server error during verification.'}`)
                setIsLoading(false)
            }
        } catch (error) {
            console.error("Verification failed:", error)
            setStatusMessage("Verification failed due to a network error. Please try again.")
            setIsLoading(false)
        }
    }
    
    // Initial Nonce Fetch when component loads
    useEffect(() => {
        if (availableWallets.length > 0 && !nonce && !isLoading && !nonceFetchFailed) {
            fetchNonce();
        }
    }, [availableWallets, nonce, nonceFetchFailed]) 
    
    const statusType = statusMessage.includes('✅') ? 'success' : statusMessage.includes('❌') || statusMessage.includes('Error') || statusMessage.includes('Failed') ? 'error' : 'info';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl space-y-6">
                <h1 className="text-3xl font-bold text-center text-[#800020]">
                    Connect Your Wallet
                </h1>
                <p className="text-center text-gray-600">
                    A Cardano wallet is required to complete your seller verification.
                </p>

                {availableWallets.length === 0 ? (
                    <div className="text-center p-6 border rounded-lg bg-yellow-50 text-yellow-700">
                        No Cardano wallets found. Please install a browser extension like Nami, Eternl, or Lace.
                    </div>
                ) : (
                    <>
                        {/* You would typically include a wallet selection dropdown/list here */}

                        <Button
                            onClick={handleConnect}
                            // The button is disabled if loading, OR if the nonce hasn't been fetched yet
                            disabled={isLoading || !nonce} 
                            className="w-full bg-[#800020] hover:bg-[#660018] text-white py-3 rounded-lg font-semibold text-base flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Zap className="h-5 w-5" />
                            )}
                            {isLoading ? 'Processing...' : 'Connect and Verify Wallet'}
                        </Button>
                    </>
                )}
                
                {statusMessage && (
                    <div className={`mt-4 p-4 rounded-lg text-sm font-medium ${
                        statusType === 'success' ? 'bg-green-100 text-green-700' :
                        statusType === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {statusMessage}
                    </div>
                )}
                
                <div className="text-center pt-4">
                    <Button variant="link" onClick={() => router.push("/dashboard")}>
                        Skip for now (Go to Dashboard)
                    </Button>
                </div>
            </div>
        </div>
    )
}