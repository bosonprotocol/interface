import { useMemo } from "react";
import { useQuery } from "react-query";

import { fetchTextFile } from "../textFile";
import { useCurrentSellers } from "./useCurrentSellers";

interface Props {
  sellerWhitelistUrl?: string;
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
        ? await fetchTextFile(props.sellerWhitelistUrl)
        : "";
      return whitelistStr.split("\n")[0].split(",") || [];
    },
    {
      ...options
    }
  );
  return useMemo(() => {
    const sellerIdList = whitelist.data || [];
    if (
      props.allowConnectedSeller &&
      currentSeller.isSuccess &&
      currentSeller.sellerIds.length > 0 &&
      !sellerIdList?.includes(currentSeller.sellerIds[0])
    ) {
      (sellerIdList as string[]).push(currentSeller.sellerIds[0]);
    }
    return {
      isSuccess: whitelist.isSuccess || whitelist.isError,
      data: sellerIdList
    };
  }, [
    currentSeller.isSuccess,
    currentSeller.sellerIds,
    whitelist.isSuccess,
    whitelist.isError,
    whitelist.data,
    props.allowConnectedSeller
  ]);
}
