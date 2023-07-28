import { useCustomStoreQueryParameter } from "../../../pages/custom-store/useCustomStoreQueryParameter";
import { CONFIG } from "../../config";
import { parseCurationList } from "../curationList";
import { useSellerBlacklist } from "./useSellerBlacklist";

export function useCurationLists() {
  const sellerBlacklist = useSellerBlacklist({
    sellerBlacklistUrl: CONFIG.sellerBlacklistUrl,
    allowConnectedSeller: false
  });
  const sellerCurationList = sellerBlacklist.isSuccess
    ? (sellerBlacklist.curatedSellerIds as string[])
    : [];
  const sellerCurationListFromUrlParam =
    useCustomStoreQueryParameter("sellerCurationList");
  const sellerCurationListFromUrl = sellerCurationListFromUrlParam
    ? parseCurationList(sellerCurationListFromUrlParam)
    : [];
  const offerCurationListFromUrl =
    useCustomStoreQueryParameter("offerCurationList");
  const scl = CONFIG.enableCurationLists
    ? sellerCurationListFromUrlParam
      ? sellerCurationList.filter((sellerId) =>
          sellerCurationListFromUrl?.includes(sellerId)
        )
      : sellerCurationList
    : sellerCurationListFromUrlParam
    ? sellerCurationListFromUrl
    : undefined;

  return {
    enableCurationLists: CONFIG.enableCurationLists,
    // if enableCurationLists and a custom curation list is defined,
    // --> intersection between sellerCurationList and sellerCurationListFromUrl
    // if enableCurationLists and no custom curation list
    // --> sellerCurationList
    // if !enableCurationLists and a custom curation list is defined,
    // --> sellerCurationListFromUrl
    // if !enableCurationLists and no custom curation list
    // --> undefined (= no curation list = all sellers)
    sellerCurationList: scl,
    offerCurationList: offerCurationListFromUrl
      ? parseCurationList(offerCurationListFromUrl)
      : CONFIG.enableCurationLists
      ? CONFIG.offerCurationList
      : undefined,
    isError: sellerBlacklist.isError
  };
}
