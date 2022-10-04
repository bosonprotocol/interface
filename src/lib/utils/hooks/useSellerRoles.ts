import { gql } from "graphql-request";
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../core-components/subgraph";

function lowerCase(str: string | undefined) {
  return str?.toLowerCase() || "";
}
export interface SellerRolesProps {
  isSeller: boolean;
  isActive: boolean;
  isAdmin: boolean;
  isClerk: boolean;
  isOperator: boolean;
  isTreasury: boolean;
}
export function useSellerRoles(id: string) {
  const { address } = useAccount();

  const { data } = useQuery(["sellers", { id }], async () => {
    const result = await fetchSubgraph<{
      sellers: {
        id: string;
        admin: string;
        clerk: string;
        operator: string;
        treasury: string;
        active: boolean;
      }[];
    }>(
      gql`
          query GetSellerByID(
            $id: String
          ) {
            sellers(
              where: {
                ${id ? `id: "${id}"` : ""}
              }
            ) {
              id
              admin
              active
              clerk
              operator
              treasury
            }
          }
        `,
      {
        ...(id && { id })
      }
    );
    return result?.sellers[0] ?? null;
  });

  const sellerProps = useMemo(
    () => ({
      isSeller: data !== null,
      isActive: data ? data?.active : false,
      isAdmin: data ? lowerCase(data?.admin) === lowerCase(address) : false,
      isClerk: data ? lowerCase(data?.clerk) === lowerCase(address) : false,
      isOperator: data
        ? lowerCase(data?.operator) === lowerCase(address)
        : false,
      isTreasury: data
        ? lowerCase(data?.treasury) === lowerCase(address)
        : false
    }),
    [data, address]
  );

  return sellerProps as SellerRolesProps;
}
