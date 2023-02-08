import {
  MediaSet,
  NftImage,
  Profile
} from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { LensProfileType } from "./validationSchema";

export const getLensEmail = (profile: Profile): string | undefined => {
  return profile.attributes?.find((attribute) => attribute.key === "email")
    ?.value;
};

export const getLensWebsite = (profile: Profile): string | undefined => {
  return profile.attributes?.find((attribute) => attribute.key === "website")
    ?.value;
};

export const getLensLegalTradingName = (
  profile: Profile
): string | undefined => {
  return profile.attributes?.find(
    (attribute) => attribute.key === "legalTradingName"
  )?.value;
};

export const getLensProfilePictureUrl = (profile: Profile): string => {
  return (
    (profile?.picture as MediaSet)?.original?.url ||
    (profile?.picture as NftImage)?.uri ||
    ""
  );
};

export const getLensCoverPictureUrl = (profile: Profile): string => {
  return (profile?.coverPicture as MediaSet)?.original?.url || "";
};

export const getLensTokenIdDecimal = (lenseProfileId: Profile["id"]) => {
  return parseInt(lenseProfileId, 16);
};

export const getLensTokenIdHex = (lenseProfileIdDecimal: Profile["id"]) => {
  if (!lenseProfileIdDecimal) {
    return "";
  }
  const hex = Number(lenseProfileIdDecimal).toString(16);
  if (hex.length % 2 === 0) {
    return "0x" + hex;
  }
  return "0x0" + hex;
};

export const isMatchingLensHandle = (handle: string): boolean => {
  const lensHandleRegex = /^.+\.(lens|test)$/;
  return handle.match(lensHandleRegex) !== null;
};

export const getLensProfileInfo = (
  profile: Profile
): Omit<LensProfileType, "logo" | "coverPicture"> => {
  return {
    name: profile.name || "",
    handle: String(profile.handle),
    email: getLensEmail(profile) || "",
    description: profile.bio || "",
    website: getLensWebsite(profile) || "",
    legalTradingName: getLensLegalTradingName(profile) || ""
  };
};
