import { useInfiniteQuery } from "react-query";

import { CONFIG } from "../../../config";
import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useInfiniteOffers(
  props: Omit<UseOffersProps, "skip">,
  options: {
    enabled?: boolean;
    keepPreviousData?: boolean;
  } = {}
) {
  props = {
    ...props,
    sellerWhitelist: CONFIG.sellerWhitelist,
    offerWhitelist: CONFIG.offerWhitelist,
    enableWhitelists: CONFIG.enableWhitelists
  };
  return useInfiniteQuery(
    ["offers", "infinite", props.sellerId],
    async (context) => {
      const skip = context.pageParam || 0;
      return getOffers({
        ...props,
        skip
      });
    },
    {
      ...options,
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  );
}
