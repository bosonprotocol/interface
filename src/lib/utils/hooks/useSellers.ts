import { accounts, subgraph } from "@bosonprotocol/react-kit";
import { useQuery } from "react-query";

import { CONFIG } from "../../../lib/config";
import { useCurationLists } from "./useCurationLists";

interface Props {
  admin?: string;
  admin_in?: string[];
  operator?: string;
  clerk?: string;
  treasury?: string;
  id?: string;
  includeFunds?: boolean;
}

export function useSellers(
  props: Props = {},
  options: {
    enabled?: boolean;
  } = {}
) {
  const curationLists = useCurationLists();
  const filter = {
    ...(props.admin && { admin: props.admin }),
    ...(props.admin_in && { admin_in: props.admin_in }),
    ...(props.operator && { operator: props.operator }),
    ...(props.clerk && { clerk: props.clerk }),
    ...(props.treasury && { treasury: props.treasury }),
    ...(props.id && { id: props.id })
  };
  return useQuery(
    ["sellers", props],
    async () => {
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
    },
    {
      ...options
    }
  );
}
