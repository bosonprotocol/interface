import { useCustomStoreQueryParameter } from "../../../pages/custom-store/useCustomStoreQueryParameter";
import { CONFIG } from "../../config";
import { parseCurationList } from "../curationList";

export function useCurationLists() {
  const sellerCurationListFromUrl =
    useCustomStoreQueryParameter("sellerCurationList");
  const offerCurationListFromUrl =
    useCustomStoreQueryParameter("offerCurationList");

  return {
    enableCurationLists: CONFIG.enableCurationLists,
    sellerCurationList: sellerCurationListFromUrl
      ? parseCurationList(sellerCurationListFromUrl)
      : CONFIG.sellerCurationList,
    offerCurationList: offerCurationListFromUrl
      ? parseCurationList(offerCurationListFromUrl)
      : CONFIG.offerCurationList
  };
}
