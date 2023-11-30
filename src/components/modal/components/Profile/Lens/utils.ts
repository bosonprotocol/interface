import {
  MediaSet,
  NftImage,
  Profile
} from "../../../../../lib/utils/hooks/lens/graphql/generated";

export const getLensEmail = (profile: Pick<Profile, "attributes">): string => {
  return (
    profile.attributes?.find((attribute) => attribute.key === "email")?.value ??
    ""
  );
};

export const getLensWebsite = (
  profile: Pick<Profile, "attributes">
): string => {
  return (
    profile.attributes?.find((attribute) => attribute.key === "website")
      ?.value ?? ""
  );
};

export const getLensName = (profile: Pick<Profile, "name">): string => {
  return profile.name ?? "";
};

export const getLensDescription = (profile: Pick<Profile, "bio">): string => {
  return profile.bio ?? "";
};

export const getLensLegalTradingName = (
  profile: Pick<Profile, "attributes">
): string => {
  return (
    profile.attributes?.find(
      (attribute) => attribute.key === "legalTradingName"
    )?.value ?? ""
  );
};

export const getLensProfilePictureUrl = (
  profile: Pick<Profile, "picture"> | undefined
): string => {
  return (
    (profile?.picture as MediaSet)?.original?.url ||
    (profile?.picture as NftImage)?.uri ||
    ""
  );
};

export const getLensCoverPictureUrl = (
  profile: Pick<Profile, "coverPicture">
): string => {
  return (profile?.coverPicture as MediaSet)?.original?.url || "";
};

export const getLensTokenIdDecimal = (lenseProfileId: Profile["id"]) => {
  return parseInt(lenseProfileId, 16); // hex to decimal
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
