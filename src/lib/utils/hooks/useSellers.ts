import { accounts, subgraph } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

import { CONFIG } from "../../../lib/config";
import { useWhitelists } from "./useWhitelists";

interface Props {
  admin?: string;
}

export function useSellers(props: Props = {}) {
  const whitelists = useWhitelists();

  return useQuery(["sellers", props], async () => {
    return accounts.subgraph.getSellers(CONFIG.subgraphUrl, {
      sellersFilter: {
        admin: props.admin,
        id_in: whitelists.enableWhitelists
          ? whitelists.sellerWhitelist
          : undefined
      },
      sellersOrderBy: subgraph.Seller_OrderBy.SellerId,
      sellersOrderDirection: subgraph.OrderDirection.Asc
    });
  });
}
