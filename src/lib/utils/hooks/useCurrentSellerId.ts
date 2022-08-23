import { gql } from "graphql-request";
import { useQuery } from "react-query";

import { fetchSubgraph } from "../core-components/subgraph";
import { getItemFromStorage } from "./useLocalStorage";

export function useCurrentSellerId() {
  const store = getItemFromStorage("wagmi.store", {});
  const parsed = JSON.parse(store);
  const accountAddress = parsed?.state?.data?.account ?? "0x000";
  const props = {
    admin: accountAddress
  };

  const result = useQuery(["sellers", props], async () => {
    const result = await fetchSubgraph<{
      sellers: {
        sellerId: string;
      }[];
    }>(
      gql`
        query GetSellerIdByAddress($admin: String) {
          sellers(where: { admin: $admin }) {
            sellerId
          }
        }
      `,
      props
    );
    return result;
  });

  return {
    ...result,
    sellerId: result?.data?.sellers?.[0]?.sellerId ?? null
  };
}
