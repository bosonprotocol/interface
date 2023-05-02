import { useQuery } from "react-query";

import { fetchTextFile } from "../textFile";

interface Props {
  sellerWhitelistUrl?: string;
}

export function useSellerWhitelist(
  props: Props,
  options: { enabled: boolean } = { enabled: true }
) {
  return useQuery(
    "seller-whitelist",
    async () => {
      const whitelist = props.sellerWhitelistUrl
        ? await fetchTextFile(props.sellerWhitelistUrl)
        : "";
      return whitelist.split("\n")[0].split(",") || [];
    },
    {
      ...options
    }
  );
}
