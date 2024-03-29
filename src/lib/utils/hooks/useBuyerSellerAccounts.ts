import { useCallback } from "react";

import { useBuyers } from "./useBuyers";
import { useSellers } from "./useSellers";

export const useBuyerSellerAccounts = (address: string | undefined) => {
  const {
    data: sellers,
    refetch: refetchSellers,
    ...restSellers
  } = useSellers(
    {
      assistant: address
    },
    {
      enabled: !!address
    }
  );
  const {
    data: buyers,
    refetch: refetchBuyers,
    ...restBuyers
  } = useBuyers(
    {
      wallet: address
    },
    {
      enabled: !!address
    }
  );
  const sellerId = address ? sellers?.[0]?.id || "" : "";
  const buyerId = address ? buyers?.[0]?.id || "" : "";

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
