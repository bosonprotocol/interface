import { Offer } from "lib/types/offer";

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
  const baseMetadataFields = new Set([
    "name",
    "description",
    "externalUrl",
    "schemaUrl",
    "type"
  ]);
  const productV1MetadataFields = new Set(["images", "tags", "brandName"]);

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
}
