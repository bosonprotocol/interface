import { gql } from "graphql-request";
import { Offer } from "lib/types/offer";
import { fetchSubgraph } from "lib/utils/core-components/subgraph";
import { useQuery } from "react-query";

import { buildOrderBy, buildWhere, offerGraphQL } from "./graphql";
import { UseOffersProps } from "./types";
import { checkOfferMetadata } from "./validators";

export const useOffers = (props: UseOffersProps) => {
  const where = buildWhere(props);
  const orderBy = buildOrderBy();
  return useQuery(JSON.stringify(props), async () => {
    const result = await fetchSubgraph<{
      baseMetadataEntities: { offer: Offer }[];
    }>(
      gql`
        {
          baseMetadataEntities(first: 10, where: ${where}, ${orderBy}) {
            offer ${offerGraphQL}
          }
          
        }
      `
    );
    const { filterOutWrongMetadata } = props;
    return result?.baseMetadataEntities
      ?.filter((base) =>
        filterOutWrongMetadata ? checkOfferMetadata(base.offer) : true
      )
      .map((base) => base.offer);
  });
};
