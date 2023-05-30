import { SelectType } from "./types";

export type AdditionalFooterLink = SelectType<AdditionalFooterLinksValues> & {
  url: string;
};

export type AdditionalFooterLinksValues =
  | "home"
  | "email"
  | "contact_us"
  | "how_boson_works"
  | "terms_of_service"
  | "privacy_policy"
  | "custom"
  | `custom_${number}`;
