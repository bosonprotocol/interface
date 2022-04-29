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
  const baseMetadataFields = [
    "name",
    "description",
    "externalUrl",
    "schemaUrl",
    "type"
  ];
  const productV1MetadataFields = ["images", "tags", "brandName"];

  if (!offer) {
    return false;
  }
  const { metadata } = offer;
  if (!metadata || !metadata.type) {
    return false;
  }

  switch (metadata.type) {
    case "BASE":
      return baseMetadataFields.every((field) => field in metadata);
    case "PRODUCT_V1":
      return [...baseMetadataFields, ...productV1MetadataFields].every(
        (field) => field in metadata
      );
  }
  return false;
}
