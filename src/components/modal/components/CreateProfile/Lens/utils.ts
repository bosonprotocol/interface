import {
  MediaSet,
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

export const getLensProfilePictureUrl = (profile: Profile) => {
  return (profile?.picture as MediaSet)?.original.url || "";
};

export const getLensCoverPictureUrl = (profile: Profile) => {
  return (profile?.coverPicture as MediaSet)?.original.url || "";
};

export const getLensTokenId = (lenseProfileId: Profile["id"]) => {
  return parseInt(lenseProfileId, 16);
};
