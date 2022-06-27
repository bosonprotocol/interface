import { useQuery } from "react-query";

import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useOffers(
  props: UseOffersProps,
  options: {
    enabled?: boolean;
  } = {}
) {
  return useQuery(
    ["offers", props],
    async () => {
      return getOffers(props);
    },
    {
      ...options
    }
  );
}
