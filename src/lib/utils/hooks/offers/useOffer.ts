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
      restProps = {
        sellerWhitelist: CONFIG.sellerWhitelist,
        offerWhitelist: CONFIG.offerWhitelist,
        enableWhitelists: CONFIG.enableWhitelists,
        ...restProps
      };
      const offer = await getOfferById(offerId, {
        ...restProps
      });

      return offer;
    },
    {
      ...options
    }
  );
}
