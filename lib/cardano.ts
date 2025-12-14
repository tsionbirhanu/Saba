import {
  Address,
  RewardAddress,
} from "@emurgo/cardano-serialization-lib-browser"

export const getAvailableWallets = () => {
  if (typeof window === "undefined") return []
  const cardano = (window as any).cardano
  if (!cardano) return []

  return Object.keys(cardano).filter(
    (key) => typeof cardano[key]?.enable === "function"
  )
}

export const connectWallet = async (walletName: string) => {
  const wallet = (window as any).cardano?.[walletName]
  if (!wallet) throw new Error("Wallet not found")

  const enabled = await wallet.isEnabled?.()
  return enabled ? wallet : await wallet.enable()
}

export const getBech32RewardAddress = async (walletApi: any) => {
  const rewardAddresses = await walletApi.getRewardAddresses()
  if (!rewardAddresses.length) throw new Error("No reward address")

  const hex = rewardAddresses[0]

  const rewardAddr = RewardAddress.from_address(
    Address.from_bytes(Buffer.from(hex, "hex"))
  )

  if (!rewardAddr) throw new Error("Invalid reward address")

  return rewardAddr.to_address().to_bech32()
}
