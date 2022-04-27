import { Offer } from "lib/types/offer";

export const checkOfferMetadata = (offer: Offer): boolean => {
  // TODO: what does it mean that an offer is invalid, has missing metadata fields or is not complete?
  const baseMetadataFields = new Set([
    "name",
    "description",
    "externalUrl",
    "schemaUrl",
    "type"
  ]);
  const productV1MetadataFields = new Set(["images", "tags", "brandName"]);
  /**
   * Checks that the required fields exist in the offer
   * @param offer
   * @returns true if the offer's metadata fields are not complete/invalid/missing
   */
  const checkIfOfferMetadata = (offer: Offer): boolean => {
    if (!offer) {
      return false;
    }
    const { metadata } = offer;
    if (!metadata || !metadata.type) {
      return false;
    }

    switch (metadata.type) {
      case "BASE":
        return Object.keys(metadata).every((metadataKey) =>
          baseMetadataFields.has(metadataKey)
        );
      case "PRODUCT_V1":
        return Object.keys(metadata).every(
          (metadataKey) =>
            baseMetadataFields.has(metadataKey) ||
            productV1MetadataFields.has(metadataKey)
        );
    }
    return false;
  };
  const isValid = checkIfOfferMetadata(offer);
  if (!isValid) {
    console.error(
      `This offer (${JSON.stringify(offer)}) has an invalid metadata`
    );
  }
  return isValid;
};
