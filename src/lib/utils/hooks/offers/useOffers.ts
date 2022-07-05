import { useQuery } from "react-query";

import { CONFIG } from "../../../config";
import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useOffers(
  props: UseOffersProps,
  options: {
    enabled?: boolean;
  } = {}
) {
  props = {
    ...props,
    sellerWhitelist: CONFIG.sellerWhitelist,
    offerWhitelist: CONFIG.offerWhitelist,
    enableWhitelists: CONFIG.enableWhitelists
  };
  return useQuery(
    ["offers", props],
    async () => {
      return getOffers({
        ...props
      });
    },
    {
      ...options
    }
  );
}
