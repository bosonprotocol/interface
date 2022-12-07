import { offers as OffersKit } from "@bosonprotocol/react-kit";
import { subgraph } from "@bosonprotocol/react-kit";

export function getProductStatusBasedOnVariants(
  variants: subgraph.OfferFieldsFragment[]
): OffersKit.OfferState | "" {
  const anyValid = variants.some(
    (variant) =>
      OffersKit.getOfferStatus(variant) === OffersKit.OfferState.VALID
  );
  if (anyValid) {
    return OffersKit.OfferState.VALID;
  }
  const anyNotYetValid = variants.some(
    (variant) =>
      OffersKit.getOfferStatus(variant) === OffersKit.OfferState.NOT_YET_VALID
  );
  if (anyNotYetValid) {
    return OffersKit.OfferState.NOT_YET_VALID;
  }
  const anyExpired = variants.some(
    (variant) =>
      OffersKit.getOfferStatus(variant) === OffersKit.OfferState.EXPIRED
  );
  if (anyExpired) {
    return OffersKit.OfferState.EXPIRED;
  }
  const allVoided = variants.every(
    (variant) =>
      OffersKit.getOfferStatus(variant) === OffersKit.OfferState.VOIDED
  );
  if (allVoided) {
    return OffersKit.OfferState.VOIDED;
  }
  return "";
}
