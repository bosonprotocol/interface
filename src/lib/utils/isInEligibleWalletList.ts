import { CONFIG } from "../config";

export const isInEligibleWalletList = (sellerWalletAddress: string) => {
  return (
    CONFIG.enableCurationLists &&
    CONFIG.eligibleSellerWalletAddresses?.includes(sellerWalletAddress)
  );
};
