import { generatePath } from "react-router-dom";

import { DEFAULT_SELLER_PAGE } from "../../components/seller/SellerPages";
import { CONFIG } from "../config";
import { UrlParameters } from "../routing/parameters";
import { BosonRoutes, SellerCenterRoutes } from "../routing/routes";
import { isInEligibleWalletList } from "./isInEligibleWalletList";

export const getSellLink = ({
  isAccountSeller,
  address
}: {
  isAccountSeller: boolean;
  address: string | undefined | null;
}) => {
  if (CONFIG.enableCurationLists) {
    if (isAccountSeller) {
      return generatePath(SellerCenterRoutes.SellerCenter, {
        [UrlParameters.sellerPage]: DEFAULT_SELLER_PAGE
      });
    }
    if (isInEligibleWalletList(address ?? "")) {
      return SellerCenterRoutes.CreateProduct;
    }
    return BosonRoutes.ClosedBeta;
  }
  if (isAccountSeller) {
    return generatePath(SellerCenterRoutes.SellerCenter, {
      [UrlParameters.sellerPage]: DEFAULT_SELLER_PAGE
    });
  }
  return SellerCenterRoutes.CreateProduct;
};
