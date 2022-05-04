import { Offer } from "lib/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useQuery } from "react-query";

import { GET_OFFERS_QUERY } from "./graphql";
import { UseOfferProps, UseOffersProps } from "./types";
import { checkOfferMetadata } from "./validators";

const getOfferById = async (id: string, props: UseOffersProps) => {
  const now = Math.floor(Date.now() / 1000);

  const result = await fetchSubgraph<{
    baseMetadataEntities: { offer: Offer }[];
  }>(GET_OFFERS_QUERY, {
    offer: id,
    validFromDate_lte: now + "",
    validUntilDate_gte: now + "",
    name_contains_nocase: props.name || "",
    exchangeToken: props.exchangeTokenAddress
  });
  return result.baseMetadataEntities[0]?.offer;
};

export const useOffer = ({ offerId, ...restProps }: UseOfferProps) => {
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
};
