import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { Offer } from "../../../lib/types/offer";
import { fetchSubgraph } from "../core-components/subgraph";

interface Props {
  admin?: string;
}
export function useSellers(props: Props = {}) {
  return useQuery(["sellers", props], async () => {
    const result = await fetchSubgraph<{
      sellers: Pick<
        Offer["seller"],
        "id" | "operator" | "admin" | "clerk" | "treasury" | "active"
      >[];
    }>(
      gql`
        query GetSellers(
          $orderBy: String
          $orderDirection: String
          $admin: String
        ) {
          sellers(
            orderBy: $orderBy
            orderDirection: $orderDirection
            ${props.admin ? "where: { admin: $admin }" : ""}
          ) {
            id
            operator
            admin
            clerk
            treasury
            active
          }
        }
      `,
      {
        orderBy: "sellerId",
        orderDirection: "asc",
        ...(props.admin && { admin: props.admin })
      }
    );
    return result?.sellers ?? [];
  });
}
