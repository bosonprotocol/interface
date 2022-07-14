import { Page } from "@playwright/test";

import { Offer } from "../src/lib/types/offer";
import { expect, test } from "./baseFixtures";
import { defaultMockOffers } from "./mocks/defaultMockOffers";
import { mockSubgraph } from "./mocks/mockGetBase";

const offersUrl = "/#/offers/";

const assertOfferDetail = async (expectedOffer: Offer, page: Page) => {
  const name = page.locator("[data-testid=name]");
  await expect(name).toHaveText(
    expectedOffer.metadata?.name || "expected name"
  );

  const image = page.locator("[data-testid=offerImage]");
  expect(await image.getAttribute("src")).toBeTruthy();

  const description = page.locator("[data-testid=description]");
  await expect(description).toHaveText(
    expectedOffer.metadata?.description || "Unexpected description"
  );

  const sellerId = page.locator("[data-testid=seller-info]");
  const expectedSellerId =
    "Seller ID: " + expectedOffer.seller?.id || "Unexpected id";
  await expect(sellerId).toHaveText(expectedSellerId);
};

test.describe("OfferDetail", () => {
  test("should display 'There has been an error, please try again later...' if we get a 500 error", async ({
    page
  }) => {
    const response = {
      status: 500,
      body: JSON.stringify({
        data: {}
      }),
      contentType: "application/json"
    };

    await mockSubgraph({ page, options: { mockGetOffers: { response } } });

    await page.goto(`${offersUrl}6`);
    const errorOfferSelector = "[data-testid=errorOffer]";
    await page.waitForSelector(errorOfferSelector);
    const noOffers = page.locator(errorOfferSelector);
    await expect(noOffers).toHaveText(
      "There has been an error, please try again later..."
    );
  });
  test("should display an error if the offer does not exist", async ({
    page
  }) => {
    await mockSubgraph({ page, options: { mockGetOffers: { offers: [] } } });

    await page.goto(`${offersUrl}6`);
    const notFoundSelector = "[data-testid=notFound]";
    await page.waitForSelector(notFoundSelector);
    const noOffers = page.locator(notFoundSelector);
    await expect(noOffers).toHaveText("This offer does not exist");
  });
  test.skip("should display an error if the offer does exist but is not valid", async ({
    page
  }) => {
    const expectedOffer: Offer = {
      ...defaultMockOffers[0],
      validFromDate: "" + Math.floor(Date.now() / 1000 - 10000),
      validUntilDate: "" + Math.floor(Date.now() / 1000 - 10000)
    };
    await mockSubgraph({
      page,
      options: { mockGetOffers: { offers: [expectedOffer] } }
    });

    await page.goto(`${offersUrl}6`);
    const notFoundSelector = "[data-testid=notFound]";
    await page.waitForSelector(notFoundSelector);
    const noOffers = page.locator(notFoundSelector);
    await expect(noOffers).toHaveText("This offer does not exist");
  });
  test("should display the offer if it does exist and it's valid", async ({
    page
  }) => {
    const expectedOffer: Offer = {
      ...defaultMockOffers[0],
      validFromDate: "" + Math.floor(Date.now() / 1000),
      validUntilDate: "" + Math.floor(Date.now() / 1000 + 10000000)
    };
    await mockSubgraph({
      page,
      options: { mockGetOffers: { offers: [expectedOffer] } }
    });

    await page.goto(`${offersUrl}${expectedOffer.id}`);

    await assertOfferDetail(expectedOffer, page);
  });
});
