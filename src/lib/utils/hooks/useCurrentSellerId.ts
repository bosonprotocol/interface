import { gql } from "graphql-request";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { fetchSubgraph } from "../core-components/subgraph";

export function useCurrentSellerId() {
  const { address } = useAccount();
  const props = { address };
  const result = useQuery(["sellers", props], async () => {
    const result = await fetchSubgraph<{
      admin: {
        sellerId: string;
      }[];
      clerk: {
        sellerId: string;
      }[];
      operator: {
        sellerId: string;
      }[];
      treasury: {
        sellerId: string;
      }[];
    }>(
      gql`
        query GetSellerIdByAddress($address: String) {
          admin: sellers(where: { admin: $address }) {
            sellerId
          }
          clerk: sellers(where: { clerk: $address }) {
            sellerId
          }
          operator: sellers(where: { operator: $address }) {
            sellerId
          }
          treasury: sellers(where: { treasury: $address }) {
            sellerId
          }
        }
      `,
      props
    );
    const allProps = {
      admin: result?.admin[0]?.sellerId || null,
      clerk: result?.clerk[0]?.sellerId || null,
      operator: result?.operator[0]?.sellerId || null,
      treasury: result?.treasury[0]?.sellerId || null
    };
    return Object.fromEntries(
      Object.entries(allProps).filter(([, value]) => value !== null)
    );
  });

  return {
    ...result,
    sellerId: (result.data && Object.values(result.data)[0]) ?? null,
    sellerType: result.data && Object.keys(result.data)
  };
}
