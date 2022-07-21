import { useQuery } from "react-query";

import { useCurationLists } from "../useCurationLists";
import { getOfferById } from "./getOffers";
import { UseOfferProps } from "./types";

export function useOffer(
  props: UseOfferProps,
  options: {
    enabled?: boolean;
  } = {}
) {
  const curationLists = useCurationLists();

  props = {
    ...props,
    ...curationLists
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
