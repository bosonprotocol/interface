import { accounts, subgraph } from "@bosonprotocol/react-kit";
import { useCallback } from "react";
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
    sellerWhitelistUrl: CONFIG.sellerWhitelistUrl,
    allowConnectedSeller: true
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
    sellerWhitelistUrl: CONFIG.sellerWhitelistUrl,
    allowConnectedSeller: true
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
  return useQuery(
    ["sellers", props],
    async () => {
      console.log("currentSeller", currentSeller);
      console.log("sellerWhitelist", sellerWhitelist);
      return accounts.subgraph.getSellers(CONFIG.subgraphUrl, {
        sellersFilter: {
          ...filter,
          id_in: curationLists.enableCurationLists
            ? sellerWhitelist.data || []
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
