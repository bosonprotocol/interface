import { UrlParameters } from "lib/routing/parameters";
import { BundleRoutes, ProductRoutes } from "lib/routing/routes";
import type { ExtendedOffer } from "pages/explore/WithAllOffers";
import { generatePath } from "react-router-dom";

export function getOfferDetailPage(
  offer: Pick<ExtendedOffer, "seller" | "metadata" | "uuid">,
  sellerId?: string | undefined
): string;
export function getOfferDetailPage(
  offer: Pick<ExtendedOffer, "metadata" | "uuid">,
  sellerId: string
): string;
export function getOfferDetailPage(
  offer:
    | Pick<ExtendedOffer, "seller" | "metadata" | "uuid">
    | Pick<ExtendedOffer, "metadata" | "uuid">,
  sellerId?: string | undefined
): string {
  let pathname: string;
  const sellerIdValue = sellerId
    ? sellerId
    : "seller" in offer
      ? offer.seller?.id || ""
      : "";
  if (offer.metadata?.__typename === "BundleMetadataEntity") {
    pathname = generatePath(BundleRoutes.BundleDetail, {
      [UrlParameters.sellerId]: sellerIdValue,
      [UrlParameters.uuid]: offer?.metadata.bundleUuid || ""
    });
  } else {
    pathname = generatePath(ProductRoutes.ProductDetail, {
      [UrlParameters.sellerId]: sellerIdValue,
      [UrlParameters.uuid]: offer?.uuid || ""
    });
  }
  return pathname;
}
