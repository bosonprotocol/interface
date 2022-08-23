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

  return useQuery(["sellers", props], async () => {
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
    console.log(result);
    return result?.sellers?.[0] ?? null;
  });
}
