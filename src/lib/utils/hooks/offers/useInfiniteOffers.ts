import { useInfiniteQuery } from "react-query";

import { CONFIG } from "../../../config";
import { useCurationLists } from "../useCurationLists";
import { useSellerWhitelist } from "../useSellerWhitelist";
import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useInfiniteOffers(
  props: Omit<UseOffersProps, "skip">,
  options: {
    enabled?: boolean;
    keepPreviousData?: boolean;
    refetchOnMount?: boolean;
  } = {}
) {
  const sellerWhitelist = useSellerWhitelist({
    sellerWhitelistUrl: CONFIG.sellerWhitelistUrl,
    allowConnectedSeller: true
  });
  const curationLists = useCurationLists();

  props = {
    ...props,
    ...curationLists,
    sellerCurationList: sellerWhitelist.isSuccess ? sellerWhitelist.data : []
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
      refetchOnMount: options.refetchOnMount || false
    }
  );
}
