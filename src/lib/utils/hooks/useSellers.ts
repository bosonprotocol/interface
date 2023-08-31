import { accounts, subgraph } from "@bosonprotocol/react-kit";
import { useCallback } from "react";
import { useQuery } from "react-query";

import { CONFIG } from "../../../lib/config";
import { useCurationLists } from "./useCurationLists";

interface Props {
  admin?: string;
  admin_in?: string[];
  assistant?: string;
  treasury?: string;
  id?: string;
  includeFunds?: boolean;
  enableCurationList?: boolean;
}

export const useSellerCurationListFn = () => {
  const curationLists = useCurationLists();

  const isSellerInCurationList = useCallback(
    (sellerID: string) => {
      if (curationLists?.sellerCurationList && sellerID !== "") {
        return curationLists.sellerCurationList.includes(sellerID as string);
      } else if (!curationLists?.enableCurationLists) {
        return true;
      }

      return false;
    },
    [curationLists]
  );

  return isSellerInCurationList;
};

export function useSellers(
  props: Props = {},
  options: {
    enabled: boolean;
  }
) {
  const curationLists = useCurationLists();
  const filter = {
    ...(props.admin && { admin: props.admin }),
    ...(props.admin_in && { admin_in: props.admin_in }),
    ...(props.assistant && { assistant: props.assistant }),
    ...(props.treasury && { treasury: props.treasury }),
    ...(props.id && { id: props.id })
  };
  return useQuery(
    ["sellers", props],
    async () => {
      return accounts.subgraph.getSellers(CONFIG.subgraphUrl, {
        sellersFilter: {
          ...filter,
          id_in: curationLists.sellerCurationList
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
