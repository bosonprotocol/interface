import { accounts, subgraph } from "@bosonprotocol/react-kit";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";

import { CONFIG } from "../../../lib/config";
import { useCurationLists } from "./useCurationLists";
import { useCurrentSellers } from "./useCurrentSellers";
import { useSellerWhitelist } from "./useSellerWhitelist";

interface Props {
  admin?: string;
  admin_in?: string[];
  assistant?: string;
  clerk?: string;
  treasury?: string;
  id?: string;
  includeFunds?: boolean;
  enableCurationList?: boolean;
  allowConnectedSeller?: boolean;
}

export const useSellerCurationListFn = () => {
  const curationLists = useCurationLists();

  const sellerWhitelist = useSellerWhitelist({
    sellerWhitelistUrl: CONFIG.sellerWhitelistUrl
  });
  console.log({ sellerWhitelist });

  const isSellerInCurationList = useCallback(
    (sellerID: string) => {
      if (curationLists?.enableCurationLists && sellerID !== "") {
        if (
          sellerWhitelist.isSuccess &&
          sellerWhitelist.data.indexOf(sellerID as string) > -1
        ) {
          return true;
        }
      } else if (!curationLists?.enableCurationLists) {
        return true;
      }

      return false;
    },
    [curationLists, sellerWhitelist]
  );

  return isSellerInCurationList;
};

export function useSellers(
  props: Props = {},
  options: {
    enabled: boolean;
  }
) {
  const { address } = useAccount();
  const currentSeller = useCurrentSellers({ address });
  const sellerWhitelist = useSellerWhitelist({
    sellerWhitelistUrl: CONFIG.sellerWhitelistUrl
  });
  const curationLists = useCurationLists();
  const filter = {
    ...(props.admin && { admin: props.admin }),
    ...(props.admin_in && { admin_in: props.admin_in }),
    ...(props.assistant && { assistant: props.assistant }),
    ...(props.clerk && { clerk: props.clerk }),
    ...(props.treasury && { treasury: props.treasury }),
    ...(props.id && { id: props.id })
  };
  const sellerList = useMemo(() => {
    const enableCurationList =
      props.enableCurationList === undefined ? true : props.enableCurationList;
    const _sellerList = enableCurationList
      ? curationLists.enableCurationLists && sellerWhitelist.isSuccess
        ? sellerWhitelist.data
        : []
      : undefined;
    if (
      enableCurationList &&
      props.allowConnectedSeller &&
      currentSeller.isSuccess &&
      currentSeller.sellerIds.length > 0 &&
      !_sellerList?.includes(currentSeller.sellerIds[0])
    ) {
      (_sellerList as string[]).push(currentSeller.sellerIds[0]);
    }
    return _sellerList;
  }, [curationLists, currentSeller, props, sellerWhitelist]);
  return useQuery(
    ["sellers", props],
    async () => {
      console.log("currentSeller", currentSeller);
      console.log("sellerList", sellerList);
      return accounts.subgraph.getSellers(CONFIG.subgraphUrl, {
        sellersFilter: {
          ...filter,
          id_in: sellerList
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
