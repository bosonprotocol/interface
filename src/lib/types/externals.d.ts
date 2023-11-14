declare module "@metamask/jazzicon";

declare module "pretty";

declare module "*.ttf";

declare module "json-fn" {
  export const stringify: (fn: unknown) => string;
  export const parse: (fn: string | undefined | unknown) => unknown;
}
