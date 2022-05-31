import { useQuery } from "react-query";

import { Offer } from "../../../types/offer";
import { fetchSubgraph } from "../../../utils/core-components/subgraph";
import { getOffersQuery } from "./graphql";
import { UseOfferProps, UseOffersProps } from "./types";
import { checkOfferMetadata } from "./validators";

export function useOffer({ offerId, ...restProps }: UseOfferProps) {
  return useQuery(
    ["offer", offerId],
    async () => {
      const offer = await getOfferById(offerId, restProps);
      if (offer && checkOfferMetadata(offer)) {
        return offer;
      }
      return null;
    },
    {
      enabled: !!offerId
    }
  );
}

async function getOfferById(id: string, props: UseOffersProps) {
  const now = Math.floor(Date.now() / 1000);
  const validFromDate_lte = props.valid ? now + "" : null;
  const validUntilDate_gte = props.valid ? now + "" : null;

  const result = await fetchSubgraph<{
    baseMetadataEntities: { offer: Offer }[];
  }>(
    getOffersQuery({
      exchangeToken: !!props.exchangeTokenAddress,
      sellerId: !!props.sellerId,
      validFromDate_lte: !!validFromDate_lte,
      validUntilDate_gte: !!validUntilDate_gte,
      skip: !!props.skip,
      offer: true
    }),
    {
      offer: id,
      validFromDate_lte: validFromDate_lte,
      validUntilDate_gte: validUntilDate_gte,
      name_contains_nocase: props.name || "",
      exchangeToken: props.exchangeTokenAddress,
      sellerId: props.sellerId
    }
  );
  return result.baseMetadataEntities[0]?.offer;
}
