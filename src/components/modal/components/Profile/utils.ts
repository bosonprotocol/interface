import { SellerFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";

import {
  CreateProfile,
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE
} from "../../../product/utils";

export function buildProfileFromMetadata(
  metadata: SellerFieldsFragment["metadata"]
): CreateProfile {
  const profileImage = metadata?.images?.find((img) => img.tag === "profile");
  const coverPicture = metadata?.images?.find((img) => img.tag === "cover");
  const profileDataFromMetadata: CreateProfile = {
    name: metadata?.name ?? "",
    description: metadata?.description ?? "",
    email: metadata?.contactLinks?.find((cl) => cl.tag === "email")?.url ?? "",
    legalTradingName: metadata?.legalTradingName ?? undefined,
    website: metadata?.website ?? "",
    coverPicture: coverPicture
      ? [{ ...coverPicture, src: coverPicture.url }] ?? []
      : [],
    logo: profileImage
      ? [{ ...profileImage, src: profileImage.url }] ?? []
      : [],
    contactPreference:
      OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE.find(
        (obj) => obj.value === metadata?.contactPreference
      ) ?? OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE[0]
  };
  return profileDataFromMetadata;
}
