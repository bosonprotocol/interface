// import { expect, Page } from "@playwright/test";
import { Page } from "@playwright/test";

import { expect } from "../baseFixtures";

export async function assertUrlHashToEqual(page: Page, expectedHash: string) {
  const url = await page.url();
  const { hash } = new URL(url);
  await expect(hash).toStrictEqual(expectedHash);
}
