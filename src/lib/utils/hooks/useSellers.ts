import { accounts, subgraph } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";

import { CONFIG } from "../../../lib/config";
import { useCurationLists } from "./useCurationLists";

interface Props {
  admin?: string;
  operator?: string;
  includeFunds?: boolean;
}

export function useSellers(props: Props = {}) {
  const curationLists = useCurationLists();
  const filter = {
    ...(props.admin && { admin: props.admin }),
    ...(props.operator && { operator: props.operator })
  };
  return useQuery(["sellers", props], async () => {
    return accounts.subgraph.getSellers(CONFIG.subgraphUrl, {
      sellersFilter: {
        ...filter,
        id_in: curationLists.enableCurationLists
          ? curationLists.sellerCurationList
          : undefined
      },
      sellersOrderBy: subgraph.Seller_OrderBy.SellerId,
      sellersOrderDirection: subgraph.OrderDirection.Asc,
      includeFunds: props.includeFunds
    });
  });
}
