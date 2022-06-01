import { Page } from "@playwright/test";

import { expect } from "../baseFixtures";

export function assertUrlHashToEqual(page: Page, expectedHash: string) {
  const url = page.url();
  const { hash } = new URL(url);
  expect(hash).toStrictEqual(expectedHash);
}
