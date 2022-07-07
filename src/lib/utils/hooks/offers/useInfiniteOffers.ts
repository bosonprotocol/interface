import { useInfiniteQuery } from "react-query";

import { useWhitelists } from "../useWhitelists";
import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useInfiniteOffers(
  props: Omit<UseOffersProps, "skip">,
  options: {
    enabled?: boolean;
    keepPreviousData?: boolean;
  } = {}
) {
  const whitelists = useWhitelists();

  props = {
    ...props,
    ...whitelists
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
