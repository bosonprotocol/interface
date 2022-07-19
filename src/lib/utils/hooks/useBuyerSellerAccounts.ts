import { useBuyers } from "./useBuyers";
import { useSellers } from "./useSellers";

export const useBuyerSellerAccounts = (address: string) => {
  const { data: sellers, ...restSellers } = useSellers({
    admin: address
  });
  const { data: buyers, ...restBuyers } = useBuyers({
    wallet: address
  });
  const sellerId = sellers?.[0]?.id || "";
  const buyerId = buyers?.[0]?.id || "";
  return {
    seller: {
      ...restSellers,
      sellerId
    },
    buyer: {
      ...restBuyers,
      buyerId
    }
  };
};
