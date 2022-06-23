import { useInfiniteQuery } from "react-query";

import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useInfiniteOffers(
  props: Omit<UseOffersProps, "skip">,
  options: {
    enabled?: boolean;
    keepPreviousData?: boolean;
  } = {}
) {
  const queryKey = ["offers", props];
  return useInfiniteQuery(
    queryKey,
    async (context) => {
      const skip = context.pageParam || 0;
      return getOffers({ ...props, skip });
    },
    {
      ...options
    }
  );
}
