import { generatePath } from "react-router-dom";

import { DEFAULT_SELLER_PAGE } from "../../components/seller/SellerPages";
import { UrlParameters } from "../routing/parameters";
import { SellerCenterRoutes } from "../routing/routes";

export const getSellLink = ({
  isAccountSeller
}: {
  isAccountSeller: boolean;
}) => {
  if (isAccountSeller) {
    return generatePath(SellerCenterRoutes.SellerCenter, {
      [UrlParameters.sellerPage]: DEFAULT_SELLER_PAGE
    });
  }
  return SellerCenterRoutes.CreateProduct;
};
