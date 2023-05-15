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

  return {
    enableCurationLists: CONFIG.enableCurationLists,
    sellerCurationList: sellerCurationListFromUrlParam
      ? sellerCurationList.filter((sellerId) =>
          sellerCurationListFromUrl?.includes(sellerId)
        )
      : sellerCurationList,
    offerCurationList: offerCurationListFromUrl
      ? parseCurationList(offerCurationListFromUrl)
      : CONFIG.offerCurationList,
    isError: sellerBlacklist.isError
  };
}
