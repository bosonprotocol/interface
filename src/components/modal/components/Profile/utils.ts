import { SellerFieldsFragment } from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { AuthTokenType } from "@bosonprotocol/react-kit";

import { Profile } from "../../../../lib/utils/hooks/lens/graphql/generated";
import {
  CreateProfile,
  OPTIONS_CHANNEL_COMMUNICATIONS_PREFERENCE
} from "../../../product/utils";
import {
  getLensCoverPictureUrl,
  getLensDescription,
  getLensEmail,
  getLensName,
  getLensProfilePictureUrl
} from "./Lens/utils";

export function buildProfileFromMetadata(
  metadata: SellerFieldsFragment["metadata"] | undefined | null,
  sellerAuthTokenType:
    | typeof AuthTokenType[keyof typeof AuthTokenType]
    | undefined
    | null,
  lensProfile: Profile | undefined | null
): CreateProfile {
  const useLens = sellerAuthTokenType === AuthTokenType.LENS;
  const regularProfileImage = metadata?.images?.find(
    (img) => img.tag === "profile"
  );
  const regularCoverPicture = metadata?.images?.find(
    (img) => img.tag === "cover"
  );
  const isLens = useLens && lensProfile;
  const lensCoverPicture = isLens
    ? { url: getLensCoverPictureUrl(lensProfile), type: "" } // type is not necessary
    : null;
  const lensProfileImage = isLens
    ? { url: getLensProfilePictureUrl(lensProfile), type: "" }
    : null;
  const coverPicture = lensCoverPicture || regularCoverPicture;
  const profileImage = lensProfileImage || regularProfileImage;
  const email = isLens
    ? getLensEmail(lensProfile) || getMetadataEmail(metadata) || ""
    : getMetadataEmail(metadata) || "";
  const profileDataFromMetadata: CreateProfile = {
    name: isLens ? getLensName(lensProfile) ?? "" : metadata?.name ?? "",
    description: isLens
      ? getLensDescription(lensProfile) ?? ""
      : metadata?.description ?? "",
    email,
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

export function buildRegularProfileFromMetadata(
  metadata: SellerFieldsFragment["metadata"] | undefined | null
): CreateProfile {
  const profileImage = metadata?.images?.find((img) => img.tag === "profile");
  const metadataCoverPicture = metadata?.images?.find(
    (img) => img.tag === "cover"
  );
  const coverPicture = metadataCoverPicture
    ? {
        ...metadataCoverPicture,
        fit: "contain",
        position: "33px 44px"
      }
    : metadataCoverPicture;
  const profileDataFromMetadata: CreateProfile = {
    name: metadata?.name ?? "",
    description: metadata?.description ?? "",
    email: getMetadataEmail(metadata),
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

export function getMetadataEmail(metadata: SellerFieldsFragment["metadata"]) {
  return metadata?.contactLinks?.find((cl) => cl.tag === "email")?.url ?? "";
}
