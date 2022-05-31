import { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const queryParams = {
  name: "name",
  currency: "currency",
  seller: "seller"
} as const;

export function assertUrlToEqualQueryParam(page: Page) {
  return (queryParam: keyof typeof queryParams, value: string | undefined) => {
    const url = page.url();
    const { hash } = new URL(url);
    const paramsObj = Object.fromEntries(
      new URLSearchParams(hash.substring(hash.indexOf("?")))
    );
    expect(paramsObj[queryParam]).toStrictEqual(value);
  };
}
