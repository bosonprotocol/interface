import { useQuery } from "react-query";

import { useCurationLists } from "../useCurationLists";
import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useOffers(
  props: UseOffersProps,
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
    ["offers", props],
    async () => {
      return getOffers(props);
    },
    options
  );
}
