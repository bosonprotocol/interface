import { METADATA_LENGTH_LIMIT as maxLength } from "@bosonprotocol/react-kit";

export enum ProfileType {
  LENS = "lens",
  REGULAR = "regular"
}

export enum ContactPreference {
  XMTP = "xmtp",
  XMTP_AND_EMAIL = "xmtp_and_email"
}
export const METADATA_LENGTH_LIMIT = maxLength;
export const maxLengthErrorMessage = `Maximum length is ${METADATA_LENGTH_LIMIT} characters`;
export const notUrlErrorMessage = "This is not a URL like: www.example.com";
