// /lib/cardano.ts (Updated for robustness against empty used addresses)

// Helper type for an injected wallet object (simplified for CIP-30)
type Wallet = {
    icon: string
    name: string
    version: string
    enable: () => Promise<any>
    isEnabled: () => Promise<boolean>
}

// Global interface for TypeScript to recognize window.cardano
declare global {
    interface Window {
        cardano?: Record<string, Wallet>
    }
}

// Function to get a list of available wallets (No change needed here)
export function getAvailableWallets(): Wallet[] {
    if (typeof window === "undefined" || !window.cardano) {
        return []
    }
    // Filter out potential non-wallet objects and ensure 'enable' exists
    return Object.values(window.cardano).filter(
        (wallet): wallet is Wallet => 
            typeof wallet === "object" && 
            wallet !== null && 
            'enable' in wallet && 
            typeof wallet.enable === 'function'
    )
}

// Function to connect to a specific wallet (No change needed here)
export async function connectWallet(walletName: string): Promise<any | null> {
    const wallets = getAvailableWallets()
    const selectedWallet = wallets.find((w) => w.name.toLowerCase() === walletName.toLowerCase())

    if (selectedWallet) {
        try {
            // This triggers the connection prompt
            const api = await selectedWallet.enable() 
            console.log(`Wallet connected: ${walletName}`)
            return api
        } catch (e) {
            console.error(`Error connecting to wallet ${walletName}:`, e)
            return null
        }
    }
    return null
}

// Function to sign a message (for login/registration)
export async function signMessage(api: any, message: string): Promise<{ signature: string, address: string } | null> {
    try {
        // --- 1. Get Address (Checking Used then Unused) ---
        
        let addresses: string[] = [];
        
        // 1a. Try to get USED addresses first
        try {
            addresses = await api.getUsedAddresses();
            console.log("Used Addresses found:", addresses.length);
        } catch (e) {
            console.warn("Could not retrieve used addresses. Attempting unused addresses.", e);
        }
        
        // 1b. If no used addresses, try UNUSED addresses
        if (addresses.length === 0) {
            try {
                const unused = await api.getUnusedAddresses();
                addresses = unused;
                console.log("Unused Addresses found:", addresses.length);
            } catch (e) {
                console.error("Could not retrieve any addresses (used or unused).", e);
            }
        }
        
        // 1c. Final check for address availability
        if (addresses.length === 0) {
            alert("Wallet Error: Could not find any active address (used or unused). Please ensure your wallet is synced and unlocked.");
            console.error("Wallet error: No active addresses available after checking both used and unused.");
            return null
        }
        
        // Use the first available address for signing identity
        const address = addresses[0]; 
        
        // --- 2. Prepare Message (Nonce) ---
        // CIP-8: sign data - Requires the message to be hex-encoded
        // Ensure you have access to the Node.js Buffer module (e.g., polyfill or configure Next.js)
        const payloadHex = Buffer.from(message, "utf8").toString("hex");
        
        // --- 3. Sign Data ---
        const signatureObject = await api.signData(address, payloadHex); 

        return { 
            signature: signatureObject.signature, // The actual signature (cborHex)
            address: address // The CborHex address used for signing
        }
    } catch (e) {
        // This catches the 'Signature failed or was rejected by the user' error
        console.error("Error signing message (Likely user rejection or API failure):", e);
        alert("Signature process failed. Check your wallet extension for a pending pop-up or ensure the wallet is unlocked and connected to the site.");
        return null
    }
}