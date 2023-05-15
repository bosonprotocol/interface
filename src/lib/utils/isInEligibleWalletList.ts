import { CONFIG } from "../config";

export const isInEligibleWalletList = (sellerWalletAddress: string) => {
  return (
    CONFIG.eligibleSellerWalletAddresses === undefined ||
    CONFIG.eligibleSellerWalletAddresses.includes(
      sellerWalletAddress.toLowerCase()
    )
  );
};
