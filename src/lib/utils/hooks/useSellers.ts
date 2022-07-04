import { accounts, subgraph } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

import { CONFIG } from "../../../lib/config";

interface Props {
  admin?: string;
}

export function useSellers(props: Props = {}) {
  return useQuery(["sellers", props], async () => {
    return accounts.subgraph.getSellers(CONFIG.subgraphUrl, {
      sellersFilter: {
        admin: props.admin,
        id_in: CONFIG.enableWhitelists ? CONFIG.sellerWhitelist : null
      },
      sellersOrderBy: subgraph.Seller_OrderBy.SellerId,
      sellersOrderDirection: subgraph.OrderDirection.Asc
    });
  });
}
