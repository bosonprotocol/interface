import { AnyMetadata, subgraph, validation } from "@bosonprotocol/react-kit";

import { Offer } from "../types/offer";

export function checkOfferMetadata(
  offer: Offer | subgraph.OfferFieldsFragment
): boolean {
  const isValid = isOfferMetadataValid(offer);

  if (!isValid) {
    console.error(
      `This offer (${JSON.stringify(offer)}) has an invalid metadata`
    );
  }

  return isValid;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function replaceNullFields(obj: Record<string, any>) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] === null) {
        console.log("replace", key, "null --> undefined");
        obj[key] = undefined;
      }
      replaceNullFields(obj[key]);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixAttributes(metadata: Record<string, any>) {
  // Create 2 new fields, keeping the old ones to not invalidate the current object
  // (that would avoid to deep clone the object)
  if (Array.isArray(metadata.attributes)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (metadata.attributes as any[]).forEach((attribute: any) => {
      attribute.trait_type = attribute.traitType;
      attribute.display_type = attribute.displayType;
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixVisualImages(metadata: Record<string, any>) {
  if (metadata.product && !metadata?.product?.visuals_images) {
    metadata.product.visuals_images = [
      {
        id: "dummy",
        url: "dummy",
        type: "IMAGE"
      }
    ];
  }
}

function isOfferMetadataValid(
  offer: Offer | subgraph.OfferFieldsFragment
): boolean {
  if (!offer.metadata) {
    return false;
  }
  try {
    replaceNullFields(offer.metadata);
    fixAttributes(offer.metadata as never);
    fixVisualImages(offer.metadata as never);
    return validation.validateMetadata(offer.metadata as AnyMetadata);
  } catch (error) {
    console.error(error);
  }
  return false;
}
