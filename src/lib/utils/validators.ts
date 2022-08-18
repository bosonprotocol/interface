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

function replaceNullFields(obj: Record<string, any>) {
  if (typeof obj === "object") {
    Object.keys(obj).forEach((key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((obj as any)[key] === null) {
        console.log("replace", key, "null --> undefined");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj as any)[key] = undefined;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      replaceNullFields((obj as any)[key]);
    });
  }
}

function fixAttributes(metadata: never) {
  // Create 2 new fields, keeping the old ones to not invalidate the current object
  // (that would avoid to deep clone the object)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (Array.isArray((metadata as any).attributes)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((metadata as any).attributes as any[]).forEach((attribute: any) => {
      attribute.trait_type = attribute.traitType;
      attribute.display_type = attribute.displayType;
    });
  }
}

function fixVisualImages(metadata: never) {
  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (metadata as any).product &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !(metadata as any)?.product?.visuals_images
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (metadata as any).product.visuals_images = [
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
