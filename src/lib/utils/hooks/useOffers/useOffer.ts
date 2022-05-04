import { gql } from "graphql-request";
import { Offer } from "lib/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useQuery } from "react-query";

import { buildOrderBy, buildWhere, offerGraphQL } from "./graphql";
import { UseOfferProps, UseOffersProps } from "./types";
import { checkOfferMetadata } from "./validators";

const getOfferById = async (id: string, props: UseOffersProps) => {
  const where = buildWhere({ ...props, offerId: id });
  const orderBy = buildOrderBy();
  const result = await fetchSubgraph<{
    baseMetadataEntities: [{ offer: Offer }];
  }>(
    gql`
      {
        baseMetadataEntities(where: ${where}, ${orderBy}) {
          offer ${offerGraphQL}
        }
      }
    `
  );
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
