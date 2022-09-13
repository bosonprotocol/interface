import { useInfiniteQuery } from "react-query";

import { useCurationLists } from "../useCurationLists";
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
  const curationLists = useCurationLists();

  props = {
    ...props,
    ...curationLists
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
