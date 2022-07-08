import { accounts, subgraph } from "@bosonprotocol/core-sdk";
import { useQuery } from "react-query";

import { CONFIG } from "../../../lib/config";
import { useCurationLists } from "./useCurationLists";

interface Props {
  admin?: string;
}

export function useSellers(props: Props = {}) {
  const curationLists = useCurationLists();

  return useQuery(["sellers", props], async () => {
    return accounts.subgraph.getSellers(CONFIG.subgraphUrl, {
      sellersFilter: {
        admin: props.admin,
        id_in: curationLists.enableCurationLists
          ? curationLists.sellerCurationList
          : undefined
      },
      sellersOrderBy: subgraph.Seller_OrderBy.SellerId,
      sellersOrderDirection: subgraph.OrderDirection.Asc
    });
  });
}
