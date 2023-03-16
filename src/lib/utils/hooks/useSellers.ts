import { accounts, subgraph } from "@bosonprotocol/react-kit";
import { useCallback } from "react";
import { useQuery } from "react-query";

import { CONFIG } from "../../../lib/config";
import { useCurationLists } from "./useCurationLists";

interface Props {
  admin?: string;
  admin_in?: string[];
  assistant?: string;
  clerk?: string;
  treasury?: string;
  id?: string;
  includeFunds?: boolean;
  enableCurationList?: boolean;
}

export const useIsSellerInCuractionList = (sellerID: string) => {
  const curationLists = useCurationLists();

  if (curationLists?.enableCurationLists && sellerID !== "") {
    if (
      (curationLists?.sellerCurationList || [])?.length > 0 &&
      (curationLists?.sellerCurationList || [])?.indexOf(sellerID as string) >
        -1
    ) {
      return true;
    }
  } else if (!curationLists?.enableCurationLists) {
    return true;
  }

  return false;
};

export const useSellerCurationListFn = () => {
  const curationLists = useCurationLists();

  const isSellerInCurationList = useCallback(
    (sellerID: string) => {
      if (curationLists?.enableCurationLists && sellerID !== "") {
        if (
          (curationLists?.sellerCurationList || [])?.length > 0 &&
          (curationLists?.sellerCurationList || [])?.indexOf(
            sellerID as string
          ) > -1
        ) {
          return true;
        }
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
    enabled?: boolean;
  } = {}
) {
  const enableCurationList =
    props.enableCurationList === undefined ? true : props.enableCurationList;
  const curationLists = useCurationLists();
  const filter = {
    ...(props.admin && { admin: props.admin }),
    ...(props.admin_in && { admin_in: props.admin_in }),
    ...(props.assistant && { assistant: props.assistant }),
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
          id_in:
            enableCurationList && curationLists.enableCurationLists
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
