import { formatUnits } from "@ethersproject/units";
import { Offer } from "@lib/types/offer";
import { expect, Locator } from "@playwright/test";
import { BigNumber } from "ethers";

export async function assertOffer(offer: Locator, expectedOffer: Offer) {
  const name = offer.locator("[data-testid=name]");
  await expect(name).toHaveText(
    expectedOffer.metadata?.name || "expected name"
  );

  const sellerId = offer.locator("[data-testid=seller-id]");
  const expectedSellerId =
    "Seller ID: " + expectedOffer.seller?.id || "Unexpected id";
  expect(sellerId).toHaveText(expectedSellerId);

  const price = offer.locator("[data-testid=price]");
  const value = formatUnits(
    BigNumber.from(expectedOffer.price),
    expectedOffer.exchangeToken?.decimals
  );
  const [integer, fractions] = value.split(".");
  const stringPrice = fractions === "0" ? integer : `${integer}.${fractions}`;
  const expectedPrice = `${stringPrice} ${
    expectedOffer.exchangeToken?.symbol || ""
  }`;

  await expect(price).toHaveText(expectedPrice);

  const commit = offer.locator("[data-testid=commit]");
  await expect(commit).toHaveText("Commit");

  const image = offer.locator("[data-testid=image]");
  expect(await image.getAttribute("src")).toBeTruthy();

  const profileImg = offer.locator("[data-testid=profileImg]");
  const svg = profileImg.locator("svg");
  expect(svg).toBeDefined();
}
