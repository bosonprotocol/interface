import { Offer } from "lib/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useQuery } from "react-query";

import { DEFAULT_EXCHANGE_TOKEN } from "./defaults";
import { GET_OFFERS_QUERY } from "./graphql";
import { UseOffersProps } from "./types";
import { checkOfferMetadata } from "./validators";

export const useOffers = (props: UseOffersProps) => {
  const now = Math.floor(Date.now() / 1000);
  return useQuery(JSON.stringify(props), async () => {
    const variables = {
      first: props.count,
      validFromDate_lte: now + "",
      validUntilDate_gte: now + "",
      name_contains_nocase: props.name || "",
      exchangeToken: props.exchangeTokenAddress || DEFAULT_EXCHANGE_TOKEN,
      orderBy: "name",
      orderDirection: "asc"
    };
    const result = await fetchSubgraph<{
      baseMetadataEntities: { offer: Offer }[];
    }>(GET_OFFERS_QUERY, variables);
    const { filterOutWrongMetadata } = props;
    return result?.baseMetadataEntities
      ?.filter((base) =>
        filterOutWrongMetadata ? checkOfferMetadata(base.offer) : true
      )
      .map((base) => base.offer);
  });
};
