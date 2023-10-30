import { accounts, subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { useMemo } from "react";
import { useQuery } from "react-query";

import { fetchTextFile } from "../textFile";
import { useCurrentSellers } from "./useCurrentSellers";

interface Props {
  sellerBlacklistUrl?: string;
  allowConnectedSeller?: boolean;
}

export function useSellerBlacklist(
  props: Props,
  options: { enabled: boolean } = { enabled: true }
): {
  isSuccess: boolean;
  isError: boolean;
  curatedSellerIds: string[] | undefined;
} {
  const { config } = useConfigContext();
  const { subgraphUrl } = config.envConfig;

  const currentSeller = useCurrentSellers();
  const allSellers = useQuery(
    ["all-sellers", props, subgraphUrl],
    async () => {
      const maxSellerPerReq = 1000;
      const fetched = await accounts.subgraph.getSellers(subgraphUrl, {
        sellersFirst: maxSellerPerReq,
        sellersOrderBy: subgraph.Seller_OrderBy.SellerId,
        sellersOrderDirection: subgraph.OrderDirection.Asc
      });
      let loop = fetched.length === maxSellerPerReq;
      let sellersSkip = maxSellerPerReq;
      while (loop) {
        const toAdd = await accounts.subgraph.getSellers(subgraphUrl, {
          sellersFirst: maxSellerPerReq,
          sellersSkip,
          sellersOrderBy: subgraph.Seller_OrderBy.SellerId,
          sellersOrderDirection: subgraph.OrderDirection.Asc
        });
        fetched.push(...toAdd);
        loop = toAdd.length === maxSellerPerReq;
        sellersSkip += maxSellerPerReq;
      }
      return fetched;
    },
    {
      ...options
    }
  );
  const { sellerBlacklistUrl } = props;
  const blacklist = useQuery(
    ["seller-blacklist", sellerBlacklistUrl],
    async () => {
      const blacklistStr = sellerBlacklistUrl
        ? await fetchTextFile(sellerBlacklistUrl, false)
        : undefined;
      return blacklistStr
        ? (JSON.parse(blacklistStr).map((id: unknown) =>
            String(id)
          ) as string[])
        : undefined;
    },
    {
      ...options
    }
  );
  return useMemo(() => {
    const sellerIdList =
      blacklist.isSuccess && blacklist.data && allSellers.isSuccess
        ? allSellers.data
            .filter((seller) => !blacklist.data?.includes(seller.id))
            .map((seller) => seller.id)
        : [];
    if (
      props.allowConnectedSeller &&
      currentSeller.isSuccess &&
      currentSeller.sellerIds.length > 0 &&
      !sellerIdList?.includes(currentSeller.sellerIds[0])
    ) {
      (sellerIdList as string[]).push(currentSeller.sellerIds[0]);
    }
    return {
      isSuccess: blacklist.isSuccess,
      isError: blacklist.isError,
      curatedSellerIds: sellerIdList
    };
  }, [
    allSellers,
    currentSeller.isSuccess,
    currentSeller.sellerIds,
    blacklist.isSuccess,
    blacklist.isError,
    blacklist.data,
    props.allowConnectedSeller
  ]);
}
