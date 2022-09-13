import { useCustomStoreQueryParameter } from "../../../pages/custom-store/useCustomStoreQueryParameter";
import { CONFIG } from "../../config";
import { parseCurationList } from "../curationList";

export function useCurationLists() {
  const withOwnProducts = useCustomStoreQueryParameter("withOwnProducts");
  const sellerCurationListFromUrl =
    useCustomStoreQueryParameter("sellerCurationList");
  const offerCurationListFromUrl =
    useCustomStoreQueryParameter("offerCurationList");

  return {
    enableCurationLists:
      withOwnProducts === "true"
        ? true
        : withOwnProducts === "false"
        ? false
        : CONFIG.enableCurationLists,
    sellerCurationList: sellerCurationListFromUrl
      ? parseCurationList(sellerCurationListFromUrl)
      : CONFIG.sellerCurationList,
    offerCurationList: offerCurationListFromUrl
      ? parseCurationList(offerCurationListFromUrl)
      : CONFIG.offerCurationList
  };
}
