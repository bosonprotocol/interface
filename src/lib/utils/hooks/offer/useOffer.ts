import { useQuery } from "react-query";

import { CONFIG } from "../../../config";
import { useCurationLists } from "../useCurationLists";
import { useSellerWhitelist } from "../useSellerWhitelist";
import { getOfferById } from "./getOffers";
import { UseOfferProps } from "./types";

export default function useOffer(
  props: UseOfferProps,
  options: {
    enabled?: boolean;
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

  return useQuery(
    ["offer", props.offerId],
    async () => {
      return getOfferById(props.offerId, props);
    },
    {
      ...options
    }
  );
}
