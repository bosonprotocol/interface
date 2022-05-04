import { Offer } from "lib/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useQuery } from "react-query";

import { GET_OFFERS_QUERY } from "./graphql";
import { UseOffersProps } from "./types";
import { checkOfferMetadata } from "./validators";

export const useOffers = (props: UseOffersProps) => {
  const now = Math.floor(Date.now() / 1000);
  return useQuery(JSON.stringify(props), async () => {
    const result = await fetchSubgraph<{
      baseMetadataEntities: { offer: Offer }[];
    }>(GET_OFFERS_QUERY, {
      first: props.count,
      validFromDate_lte: now + "",
      validUntilDate_gte: now + "",
      name_contains_nocase: props.name || "",
      exchangeToken: props.exchangeTokenAddress,
      orderBy: "name",
      orderDirection: "asc"
    });
    const { filterOutWrongMetadata } = props;
    return result?.baseMetadataEntities
      ?.filter((base) =>
        filterOutWrongMetadata ? checkOfferMetadata(base.offer) : true
      )
      .map((base) => base.offer);
  });
};
