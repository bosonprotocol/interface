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
  let lensCoverPicture = null,
    lensProfileImage = null;
  if (isLens) {
    const lensCoverPictureUrl = getLensCoverPictureUrl(lensProfile);
    const lensCoverPictureType = lensCoverPictureUrl
      ? "image/" + lensCoverPictureUrl.split(".").pop()
      : "";
    lensCoverPicture = {
      url: lensCoverPictureUrl,
      type: lensCoverPictureType
    };
    const lensProfileImageUrl = getLensProfilePictureUrl(lensProfile);
    const lensProfileImageType = lensProfileImageUrl
      ? "image/" + lensProfileImageUrl.split(".").pop()
      : "";
    lensProfileImage = {
      url: lensProfileImageUrl,
      type: lensProfileImageType
    };
  }
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
  const coverPicture = metadata?.images?.find((img) => img.tag === "cover");
  const profileDataFromMetadata: CreateProfile = {
    name: metadata?.name ?? "",
    description: metadata?.description ?? "",
    email: getMetadataEmail(metadata),
    legalTradingName: metadata?.legalTradingName ?? undefined,
    website: metadata?.website ?? "",
    coverPicture: coverPicture
      ? [
          {
            ...coverPicture,
            fit: coverPicture.fit ?? undefined,
            position: coverPicture.position ?? undefined,
            src: coverPicture.url
          }
        ] ?? []
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
