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
) {
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
    console.log("currentSeller", currentSeller);
    if (
      props.allowConnectedSeller &&
      currentSeller.isSuccess &&
      currentSeller.sellerIds.length > 0 &&
      whitelist.isSuccess &&
      !whitelist.data?.includes(currentSeller.sellerIds[0])
    ) {
      console.log("Add current seller in whitelist");
      (whitelist.data as string[]).push(currentSeller.sellerIds[0]);
    }
    return whitelist;
  }, [currentSeller, whitelist, props.allowConnectedSeller]);
}
