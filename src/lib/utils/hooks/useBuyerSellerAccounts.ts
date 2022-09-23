import { useCallback } from "react";

import { useBuyers } from "./useBuyers";
import { useSellers } from "./useSellers";

export const useBuyerSellerAccounts = (address: string) => {
  const {
    data: sellers,
    refetch: refetchSellers,
    ...restSellers
  } = useSellers({
    operator: address
  });
  const {
    data: buyers,
    refetch: refetchBuyers,
    ...restBuyers
  } = useBuyers({
    wallet: address
  });
  const sellerId = sellers?.[0]?.id || "";
  const buyerId = buyers?.[0]?.id || "";

  const refetch = useCallback(() => {
    refetchSellers();
    refetchBuyers();
  }, [refetchSellers, refetchBuyers]);

  return {
    refetch,
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
