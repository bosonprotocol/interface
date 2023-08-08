import { generatePath } from "react-router-dom";

import { UrlParameters } from "../../lib/routing/parameters";
import {
  SellerCenterRoutes,
  SellerCenterSubRoutes
} from "../../lib/routing/routes";

export const getSellerCenterPath = (
  path: keyof typeof SellerCenterSubRoutes
) => {
  return generatePath(SellerCenterRoutes.SellerCenter, {
    [UrlParameters.sellerPage]: SellerCenterSubRoutes[path]
  }) as `/${string}`;
};
