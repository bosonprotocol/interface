import { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const queryParams = {
  name: "name",
  currency: "currency",
  seller: "seller"
} as const;

export function assertUrlToEqualQueryParam(page: Page) {
  return async (queryParam: keyof typeof queryParams, value: string) => {
    const url = await page.url();
    const { hash } = new URL(url);
    const paramsObj = Object.fromEntries(
      new URLSearchParams(hash.substring(hash.indexOf("?")))
    );
    await expect(paramsObj[queryParam]).toStrictEqual(value);
  };
}
