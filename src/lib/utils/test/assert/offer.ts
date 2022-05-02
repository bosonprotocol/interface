import { formatUnits } from "@ethersproject/units";
import { expect, Locator } from "@playwright/test";
import { BigNumber } from "ethers";
import { Offer } from "lib/types/offer";

const shortenAddress = (address: string): string => {
  if (!address) {
    return address;
  }
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 4
  )}`;
};

export async function assertOffer(offer: Locator, expectedOffer: Offer) {
  const name = await offer.locator("[data-testid=name]");
  await expect(name).toHaveText(
    expectedOffer.metadata?.name || "expected name"
  );

  const sellerAddress = await offer.locator("[data-testid=sellerAddress]");
  const expectedSellerAddress = shortenAddress(
    expectedOffer.seller?.address || ""
  );

  await expect(sellerAddress).toHaveText(expectedSellerAddress);

  const price = await offer.locator("[data-testid=price]");
  const expectedPrice = `${formatUnits(
    BigNumber.from(expectedOffer.price),
    expectedOffer.exchangeToken?.decimals
  )} ${expectedOffer.exchangeToken?.symbol || ""}`;

  await expect(price).toHaveText(expectedPrice);

  const commit = await offer.locator("[data-testid=commit]");
  await expect(commit).toHaveText("Commit");

  const image = await offer.locator("[data-testid=image]");
  await expect(image.getAttribute("src")).toBeTruthy();

  const profileImg = await offer.locator("[data-testid=profileImg]");
  const svg = await profileImg.locator("svg");
  await expect(svg).toBeDefined();
}
