import { useMemo } from "react";
import { useQuery } from "react-query";

import { fetchTextFile } from "../textFile";
import { useCurrentSellers } from "./useCurrentSellers";

interface Props {
  sellerWhitelistUrl?: string;
  sellerBlacklistUrl?: string;
  allowConnectedSeller?: boolean;
}

export function useSellerWhitelist(
  props: Props,
  options: { enabled: boolean } = { enabled: true }
): { isSuccess: boolean; data: string[] | undefined } {
  const currentSeller = useCurrentSellers();
  const whitelist = useQuery(
    "seller-whitelist",
    async () => {
      const whitelistStr = props.sellerWhitelistUrl
        ? await fetchTextFile(props.sellerWhitelistUrl, false)
        : "";
      return whitelistStr.split("\n")[0].split(",") || [];
    },
    {
      ...options
    }
  );
  const blacklist = useQuery(
    "seller-blacklist",
    async () => {
      const blacklistStr = props.sellerBlacklistUrl
        ? await fetchTextFile(props.sellerBlacklistUrl, false)
        : "";
      return blacklistStr.split("\n")[0].split(",") || [];
    },
    {
      ...options
    }
  );
  return useMemo(() => {
    const sellerIdList = (whitelist.data || []).filter(
      (id) => !(blacklist.data || []).includes(id)
    );
    if (
      props.allowConnectedSeller &&
      currentSeller.isSuccess &&
      currentSeller.sellerIds.length > 0 &&
      !sellerIdList?.includes(currentSeller.sellerIds[0])
    ) {
      (sellerIdList as string[]).push(currentSeller.sellerIds[0]);
    }
    return {
      isSuccess:
        (whitelist.isSuccess || whitelist.isError) &&
        (blacklist.isSuccess || blacklist.isError),
      data: sellerIdList
    };
  }, [
    currentSeller.isSuccess,
    currentSeller.sellerIds,
    whitelist.isSuccess,
    whitelist.isError,
    whitelist.data,
    blacklist.isSuccess,
    blacklist.isError,
    blacklist.data,
    props.allowConnectedSeller
  ]);
}
