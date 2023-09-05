export const SUPPORTED_LOCALES = [
  // order as they appear in the language dropdown
  "en-US"
];
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = "en-US";
