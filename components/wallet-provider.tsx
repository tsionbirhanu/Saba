// components/wallet-provider.tsx
"use client"

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'

interface WalletContextType {
  isWalletDetected: boolean
  detectedWallets: string[]
  isConnected: boolean
  connectedWallet: string | null
  walletAddress: string | null
  refreshWallets: () => void
  connectWallet: (walletName: string, address: string) => void
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType>({
  isWalletDetected: false,
  detectedWallets: [],
  isConnected: false,
  connectedWallet: null,
  walletAddress: null,
  refreshWallets: () => {},
  connectWallet: () => {},
  disconnectWallet: () => {}
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isWalletDetected, setIsWalletDetected] = useState(false)
  const [detectedWallets, setDetectedWallets] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const hasInitialized = useRef(false)

  // Function to COMPLETELY clear all wallet data
  const clearAllWalletData = useCallback(() => {
    // Clear local state
    setIsConnected(false)
    setConnectedWallet(null)
    setWalletAddress(null)
    
    // Clear ALL localStorage items related to wallet
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('connectedWallet')
    localStorage.removeItem('walletConnection')
    localStorage.removeItem('lastWalletSession')
    
    // Clear sessionStorage
    sessionStorage.removeItem('walletSession')
    
    // Update user data in localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        user.walletVerified = false
        user.cardanoAddress = null
        if (user.designerProfile) {
          user.designerProfile.walletVerified = false
          user.designerProfile.walletAddress = null
        }
        localStorage.setItem('user', JSON.stringify(user))
      } catch (e) {
        console.error('Error updating user data:', e)
      }
    }
    
    console.log('✅ All wallet data cleared')
  }, [])

  // Function to save wallet connection
  const saveWalletConnection = useCallback((walletName: string, address: string) => {
    setIsConnected(true)
    setConnectedWallet(walletName)
    setWalletAddress(address)
    
    // Save to localStorage
    localStorage.setItem('walletAddress', address)
    localStorage.setItem('connectedWallet', walletName)
    localStorage.setItem('lastWalletSession', Date.now().toString())
    
    // Update user data
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        user.walletVerified = true
        user.cardanoAddress = address
        if (user.designerProfile) {
          user.designerProfile.walletVerified = true
          user.designerProfile.walletAddress = address
        }
        localStorage.setItem('user', JSON.stringify(user))
      } catch (e) {
        console.error('Error updating user data:', e)
      }
    }
    
    console.log(`✅ Wallet connected: ${walletName} - ${address.substring(0, 10)}...`)
  }, [])

  // Memoize the refresh function
  const refreshWallets = useCallback(() => {
    if (typeof window === 'undefined') return []
    
    const wallets: string[] = []
    const walletNames = ['nami', 'eternl', 'lace', 'flint', 'yoroi', 'gerowallet', 'typhon']
    
    walletNames.forEach(wallet => {
      if (window.cardano && window.cardano[wallet]) {
        wallets.push(wallet)
      }
    })
    
    // Only update state if wallets have actually changed
    setDetectedWallets(prevWallets => {
      if (prevWallets.length !== wallets.length || 
          prevWallets.some((wallet, idx) => wallet !== wallets[idx])) {
        setIsWalletDetected(wallets.length > 0)
        return wallets
      }
      return prevWallets
    })
    
    return wallets
  }, [])

  // Check initial wallet connection
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    
    // Check for saved wallet connection
    const savedWallet = localStorage.getItem('connectedWallet')
    const savedAddress = localStorage.getItem('walletAddress')
    
    if (savedWallet && savedAddress) {
      setIsConnected(true)
      setConnectedWallet(savedWallet)
      setWalletAddress(savedAddress)
      console.log('Found saved wallet:', savedWallet)
    }
    
    // Initial wallet detection
    refreshWallets()
  }, [refreshWallets])

  // Listen for storage changes (in case another tab disconnects)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'walletAddress' && !e.newValue) {
        // Wallet address was removed from localStorage
        clearAllWalletData()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [clearAllWalletData])

  return (
    <WalletContext.Provider 
      value={{
        isWalletDetected,
        detectedWallets,
        isConnected,
        connectedWallet,
        walletAddress,
        refreshWallets,
        connectWallet: saveWalletConnection,
        disconnectWallet: clearAllWalletData
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)