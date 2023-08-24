import { useConfigContext } from "components/config/ConfigContext";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../../core-components/subgraph";

export default function useOfferByUuid(uuid: string | undefined): {
  offerId: string | undefined;
} {
  const config = useConfigContext();
  const props = { uuid };

  const result = useQuery(["useOfferByUuid", props], async () => {
    const result = await fetchSubgraph<{
      productV1MetadataEntities: {
        offer: {
          id: string;
        };
      }[];
    }>(
      config.envConfig.subgraphUrl,
      gql`
        query GeEtOfferIdFromUuid($uuid: String) {
          productV1MetadataEntities(where: { uuid: $uuid }) {
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
