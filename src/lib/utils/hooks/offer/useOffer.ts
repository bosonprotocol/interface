import { useConfigContext } from "components/config/ConfigContext";
import { useQuery } from "react-query";

import { useCurationLists } from "../useCurationLists";
import { getOfferById } from "./getOffers";
import { UseOfferProps } from "./types";

export default function useOffer(
  props: UseOfferProps,
  options: {
    enabled?: boolean;
  } = {}
) {
  const { config } = useConfigContext();
  const curationLists = useCurationLists();

  props = {
    ...props,
    ...curationLists
  };

  return useQuery(
    ["offer", props.offerId],
    async () => {
      return getOfferById(config.envConfig.subgraphUrl, props.offerId, props);
    },
    {
      ...options
    }
  );
}
