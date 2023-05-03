import { useCustomStoreQueryParameter } from "../../../pages/custom-store/useCustomStoreQueryParameter";
import { CONFIG } from "../../config";
import { parseCurationList } from "../curationList";
import { useSellerWhitelist } from "./useSellerWhitelist";

export function useCurationLists() {
  const sellerWhitelist = useSellerWhitelist({
    sellerWhitelistUrl: CONFIG.sellerWhitelistUrl,
    allowConnectedSeller: true
  });
  const sellerCurationList = sellerWhitelist.isSuccess
    ? (sellerWhitelist.data as string[])
    : [];
  const sellerCurationListFromUrlParam =
    useCustomStoreQueryParameter("sellerCurationList");
  const sellerCurationListFromUrl = sellerCurationListFromUrlParam
    ? parseCurationList(sellerCurationListFromUrlParam)
    : [];
  const offerCurationListFromUrl =
    useCustomStoreQueryParameter("offerCurationList");

  return {
    enableCurationLists: CONFIG.enableCurationLists, // curation list is always enabled except if env var is used to disable it
    sellerCurationList: sellerCurationListFromUrlParam
      ? sellerCurationList.filter((sellerId) =>
          sellerCurationListFromUrl?.includes(sellerId)
        )
      : sellerCurationList,
    offerCurationList: offerCurationListFromUrl
      ? parseCurationList(offerCurationListFromUrl)
      : CONFIG.offerCurationList
  };
}
