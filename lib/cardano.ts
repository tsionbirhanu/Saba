// // /lib/cardano.ts (Updated for robustness against empty used addresses)

// // Helper type for an injected wallet object (simplified for CIP-30)
// type Wallet = {
//     icon: string
//     name: string
//     version: string
//     enable: () => Promise<any>
//     isEnabled: () => Promise<boolean>
// }

// // Global interface for TypeScript to recognize window.cardano
// declare global {
//     interface Window {
//         cardano?: Record<string, Wallet>
//     }
// }

// // Function to get a list of available wallets (No change needed here)
// export function getAvailableWallets(): Wallet[] {
//     if (typeof window === "undefined" || !window.cardano) {
//         return []
//     }
//     // Filter out potential non-wallet objects and ensure 'enable' exists
//     return Object.values(window.cardano).filter(
//         (wallet): wallet is Wallet => 
//             typeof wallet === "object" && 
//             wallet !== null && 
//             'enable' in wallet && 
//             typeof wallet.enable === 'function'
//     )
// }

// // Function to connect to a specific wallet (No change needed here)
// export async function connectWallet(walletName: string): Promise<any | null> {
//     const wallets = getAvailableWallets()
//     const selectedWallet = wallets.find((w) => w.name.toLowerCase() === walletName.toLowerCase())

//     if (selectedWallet) {
//         try {
//             // This triggers the connection prompt
//             const api = await selectedWallet.enable() 
//             console.log(`Wallet connected: ${walletName}`)
//             return api
//         } catch (e) {
//             console.error(`Error connecting to wallet ${walletName}:`, e)
//             return null
//         }
//     }
//     return null
// }

// // Function to sign a message (for login/registration)
// export async function signMessage(api: any, message: string): Promise<{ signature: string, address: string } | null> {
//     try {
//         // --- 1. Get Address (Checking Used then Unused) ---
        
//         let addresses: string[] = [];
        
//         // 1a. Try to get USED addresses first
//         try {
//             addresses = await api.getUsedAddresses();
//             console.log("Used Addresses found:", addresses.length);
//         } catch (e) {
//             console.warn("Could not retrieve used addresses. Attempting unused addresses.", e);
//         }
        
//         // 1b. If no used addresses, try UNUSED addresses
//         if (addresses.length === 0) {
//             try {
//                 const unused = await api.getUnusedAddresses();
//                 addresses = unused;
//                 console.log("Unused Addresses found:", addresses.length);
//             } catch (e) {
//                 console.error("Could not retrieve any addresses (used or unused).", e);
//             }
//         }
        
//         // 1c. Final check for address availability
//         if (addresses.length === 0) {
//             alert("Wallet Error: Could not find any active address (used or unused). Please ensure your wallet is synced and unlocked.");
//             console.error("Wallet error: No active addresses available after checking both used and unused.");
//             return null
//         }
        
//         // Use the first available address for signing identity
//         const address = addresses[0]; 
        
//         // --- 2. Prepare Message (Nonce) ---
//         // CIP-8: sign data - Requires the message to be hex-encoded
//         // Ensure you have access to the Node.js Buffer module (e.g., polyfill or configure Next.js)
//         const payloadHex = Buffer.from(message, "utf8").toString("hex");
        
//         // --- 3. Sign Data ---
//         const signatureObject = await api.signData(address, payloadHex); 

//         return { 
//             signature: signatureObject.signature, // The actual signature (cborHex)
//             address: address // The CborHex address used for signing
//         }
//     } catch (e) {
//         // This catches the 'Signature failed or was rejected by the user' error
//         console.error("Error signing message (Likely user rejection or API failure):", e);
//         alert("Signature process failed. Check your wallet extension for a pending pop-up or ensure the wallet is unlocked and connected to the site.");
//         return null
//     }
// }


// Types for Cardano wallet API
interface Wallet {
  name: string;
  icon: string;
  apiVersion: string;
  enable: () => Promise<any>;
  isEnabled: () => Promise<boolean>;
  getBalance: () => Promise<string>;
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<any[]>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign?: boolean) => Promise<string>;
  signData: (address: string, payload: string) => Promise<{ signature: string; key: string }>;
  submitTx: (tx: string) => Promise<string>;
}

// Extend Window interface
declare global {
  interface Window {
    cardano?: {
      [key: string]: {
        name: string;
        icon: string;
        apiVersion: string;
        enable: () => Promise<any>;
        isEnabled: () => Promise<boolean>;
      };
    };
  }
}

// Available wallets in order of preference
export const WALLETS = [
  { id: 'nami', name: 'Nami', icon: '🦊' },
  { id: 'eternl', name: 'Eternl', icon: '🌐' },
  { id: 'lace', name: 'Lace', icon: '🎀' },
  { id: 'flint', name: 'Flint', icon: '🔥' },
  { id: 'yoroi', name: 'Yoroi', icon: '👘' },
  { id: 'gerowallet', name: 'Gero', icon: '⚡' },
  { id: 'typhon', name: 'Typhon', icon: '🌀' }
];

// Check which wallets are installed
export function getAvailableWallets() {
  if (typeof window === 'undefined' || !window.cardano) {
    return [];
  }

  return WALLETS.filter(wallet => {
    return window.cardano && window.cardano[wallet.id];
  }).map(wallet => ({
    ...wallet,
    isInstalled: true,
    icon: window.cardano![wallet.id].icon || wallet.icon
  }));
}

// Connect to a specific wallet
export async function connectWallet(walletId: string): Promise<any> {
  if (typeof window === 'undefined' || !window.cardano) {
    throw new Error('No Cardano wallets detected');
  }

  const wallet = window.cardano[walletId];
  if (!wallet) {
    throw new Error(`${walletId} wallet not found`);
  }

  try {
    const api = await wallet.enable();
    console.log(`Connected to ${walletId} wallet`);
    return api;
  } catch (error) {
    console.error(`Failed to connect to ${walletId}:`, error);
    throw new Error(`Connection rejected by ${walletId} wallet`);
  }
}

// Get wallet address (main address)
export async function getWalletAddress(api: any): Promise<string> {
  try {
    // Different wallets have different methods for getting addresses
    if (api.getChangeAddress) {
      return await api.getChangeAddress();
    } else if (api.getUsedAddresses) {
      const addresses = await api.getUsedAddresses();
      return addresses[0];
    } else if (api.getUnusedAddresses) {
      const addresses = await api.getUnusedAddresses();
      return addresses[0];
    } else if (api.getAddresses) {
      const addresses = await api.getAddresses();
      return addresses[0];
    } else {
      throw new Error('Cannot get address from this wallet');
    }
  } catch (error) {
    console.error('Failed to get wallet address:', error);
    throw error;
  }
}

// Sign a message (CIP-8/30 standard)
export async function signMessage(api: any, message: string, address?: string): Promise<{ signature: string; key: string }> {
  try {
    // Try CIP-30 signData first (standard)
    if (api.signData) {
      const usedAddress = address || await getWalletAddress(api);
      return await api.signData(usedAddress, message);
    }
    
    // Fallback for wallets that don't support signData
    throw new Error('This wallet does not support message signing (CIP-30)');
  } catch (error) {
    console.error('Failed to sign message:', error);
    throw error;
  }
}

// Get wallet balance
export async function getWalletBalance(api: any): Promise<string> {
  try {
    if (api.getBalance) {
      const balance = await api.getBalance();
      return balance;
    }
    return '0';
  } catch (error) {
    console.error('Failed to get balance:', error);
    return '0';
  }
}

// Check if wallet is connected
export async function isWalletConnected(walletId: string): Promise<boolean> {
  if (typeof window === 'undefined' || !window.cardano) {
    return false;
  }

  const wallet = window.cardano[walletId];
  if (!wallet) {
    return false;
  }

  try {
    return await wallet.isEnabled();
  } catch (error) {
    return false;
  }
}

// Get wallet network (Testnet/Mainnet)
export async function getWalletNetwork(api: any): Promise<string> {
  try {
    if (api.getNetworkId) {
      const networkId = await api.getNetworkId();
      return networkId === 0 ? 'Testnet' : networkId === 1 ? 'Mainnet' : `Network ${networkId}`;
    }
    return 'Unknown';
  } catch (error) {
    return 'Unknown';
  }
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

// Verify signature (basic validation)
export function isValidCardanoAddress(address: string): boolean {
  return address.startsWith('addr') || address.startsWith('addr_test');
}