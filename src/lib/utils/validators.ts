import { AnyMetadata } from "@bosonprotocol/common";
import { validation } from "@bosonprotocol/ipfs-storage";

import { Offer } from "../types/offer";

export function checkOfferMetadata(offer: Offer): boolean {
  const isValid = isOfferMetadataValid(offer);

  if (!isValid) {
    console.error(
      `This offer (${JSON.stringify(offer)}) has an invalid metadata`
    );
  }

  return isValid;
}

function isOfferMetadataValid(offer: Offer): boolean {
  if (!offer.metadata) {
    return false;
  }
  try {
    return validation.validateMetadata(offer.metadata as AnyMetadata);
  } catch (error) {
    console.error(error);
  }
  return false;
}
