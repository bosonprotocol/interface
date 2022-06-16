import { useQuery } from "react-query";

import { Offer } from "../../../../lib/types/offer";
import { fetchSubgraph } from "../../../../lib/utils/core-components/subgraph";
import { getOffersQuery } from "./graphql";
import { UseOffersProps } from "./types";
import { checkOfferMetadata } from "./validators";

export function useOffers(
  props: UseOffersProps,
  options: {
    enabled?: boolean;
  } = {}
) {
  const now = Math.floor(Date.now() / 1000);
  const validFromDate_lte = props.valid ? now + "" : null;
  const validUntilDate_gte = props.valid ? now + "" : null;
  return useQuery(
    ["offers", props],
    async () => {
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
      return result?.baseMetadataEntities?.map((base) => {
        const isValid = checkOfferMetadata(base.offer);
        return {
          ...base.offer,
          metadata: {
            ...base.offer.metadata,
            imageUrl: `https://picsum.photos/seed/${base.offer.id}/700`
          },
          isValid
        } as Offer;
      });
    },
    {
      ...options
    }
  );
}
