import {
  MediaSet,
  NftImage,
  Profile
} from "../../../../../lib/utils/hooks/lens/graphql/generated";

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
  return lenseProfileIdDecimal
    ? "0x" + Number(lenseProfileIdDecimal).toString(16).padStart(2, "0")
    : "";
};
