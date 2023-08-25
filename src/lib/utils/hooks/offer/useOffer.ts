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
  const { subgraphUrl, defaultDisputeResolverId } = config.envConfig;

  const curationLists = useCurationLists();

  props = {
    ...props,
    ...curationLists
  };

  return useQuery(
    ["offer", props.offerId, subgraphUrl, defaultDisputeResolverId],
    async () => {
      return getOfferById(
        subgraphUrl,
        defaultDisputeResolverId,
        props.offerId,
        props
      );
    },
    {
      ...options
    }
  );
}
