import { useQuery } from "react-query";

import { useWhitelists } from "../useWhitelists";
import { getOffers } from "./getOffers";
import { UseOffersProps } from "./types";

export function useOffers(
  props: UseOffersProps,
  options: {
    enabled?: boolean;
  } = {}
) {
  const whitelists = useWhitelists();

  props = {
    ...props,
    ...whitelists
  };
  return useQuery(
    ["offers", props],
    async () => {
      return getOffers(props);
    },
    options
  );
}
