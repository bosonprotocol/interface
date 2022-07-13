import { useQuery } from "react-query";

import { CONFIG } from "../../../config";
import { getOfferById } from "./getOffers";
import { UseOfferProps } from "./types";

export function useOffer(
  { offerId, ...restProps }: UseOfferProps,
  options: {
    enabled?: boolean;
  } = {}
) {
  return useQuery(
    ["offer", offerId],
    async () => {
      const offer = await getOfferById(offerId, {
        sellerCurationList: CONFIG.sellerCurationList,
        offerCurationList: CONFIG.offerCurationList,
        enableCurationLists: CONFIG.enableCurationLists,
        ...restProps
      });

      return offer;
    },
    {
      ...options
    }
  );
}
