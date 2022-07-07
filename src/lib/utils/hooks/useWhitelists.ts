import { useCustomStoreQueryParameter } from "../../../pages/custom-store/useCustomStoreQueryParameter";
import { CONFIG } from "../../config";
import { parseWhitelist } from "../whitelist";

export function useWhitelists() {
  const sellerWhitelistFromUrl =
    useCustomStoreQueryParameter("sellerWhitelist");
  const offerWhitelistFromUrl = useCustomStoreQueryParameter("offerWhitelist");

  return {
    enableWhitelists: CONFIG.enableWhitelists,
    sellerWhitelist: sellerWhitelistFromUrl
      ? parseWhitelist(sellerWhitelistFromUrl)
      : CONFIG.sellerWhitelist,
    offerWhitelist: offerWhitelistFromUrl
      ? parseWhitelist(offerWhitelistFromUrl)
      : CONFIG.offerWhitelist
  };
}
