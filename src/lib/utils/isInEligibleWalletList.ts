import { CONFIG } from "../config";

export const isInEligibleWalletList = (sellerWalletAddress: string) => {
  return (CONFIG.eligibleSellerWalletAddresses || [])?.includes(
    sellerWalletAddress.toLowerCase()
  );
};
