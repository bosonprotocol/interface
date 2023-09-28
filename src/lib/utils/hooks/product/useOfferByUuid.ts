import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../../core-components/subgraph";

export default function useOfferByUuid(
  uuid: string | undefined,
  sellerId: string | undefined
): {
  offerId: string | undefined;
} {
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;

  const props = { uuid, sellerId };

  const result = useQuery(["useOfferByUuid", props, subgraphUrl], async () => {
    const result = await fetchSubgraph<{
      productV1MetadataEntities: {
        offer: {
          id: string;
        };
      }[];
    }>(
      subgraphUrl,
      gql`
        query GeEtOfferIdFromUuid($uuid: String, $sellerId: String) {
          productV1MetadataEntities(
            where: {
              uuid: $uuid
              ${props.sellerId ? "offer_: {sellerId: $sellerId}" : ""}
            }
          ) {
            offer {
              id
            }
          }
        }
      `,
      props
    );
    return result;
  });

  return {
    offerId:
      result?.data?.productV1MetadataEntities?.[0]?.offer?.id ?? undefined
  };
}
