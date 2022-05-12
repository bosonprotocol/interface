import { Offer } from "@lib/types/offer";
import { fetchSubgraph } from "@lib/utils/core-components/subgraph";
import { useQuery } from "react-query";

import { getOffersQuery } from "./graphql";
import { UseOffersProps } from "./types";
import { checkOfferMetadata } from "./validators";

export function useOffers(props: UseOffersProps) {
  const now = Math.floor(Date.now() / 1000);
  const validFromDate_lte = props.valid ? now + "" : null;
  const validUntilDate_gte = props.valid ? now + "" : null;

  return useQuery(JSON.stringify(props), async () => {
    const variables = {
      first: props.first,
      skip: props.skip,
      validFromDate_lte: validFromDate_lte,
      validUntilDate_gte: validUntilDate_gte,
      name_contains_nocase: props.name || "",
      exchangeToken: props.exchangeTokenAddress,
      seller: props.sellerId,
      orderBy: "name",
      orderDirection: "asc"
    };
    const result = await fetchSubgraph<{
      baseMetadataEntities: { offer: Offer }[];
    }>(
      getOffersQuery({
        exchangeToken: !!props.exchangeTokenAddress,
        sellerId: !!props.sellerId,
        validFromDate_lte: !!validFromDate_lte,
        validUntilDate_gte: !!validUntilDate_gte,
        skip: !!props.skip,
        offer: false
      }),
      variables
    );
    const { filterOutWrongMetadata } = props;
    return result?.baseMetadataEntities
      ?.filter((base) =>
        filterOutWrongMetadata ? checkOfferMetadata(base.offer) : true
      )
      .map((base) => base.offer);
  });
}
