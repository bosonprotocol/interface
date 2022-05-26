import { Offer } from "@lib/types/offer";
import { Page } from "@playwright/test";

// import { expect, Page } from "@playwright/test";
import { expect, test } from "./baseFixtures";
import { defaultMockOffers } from "./mocks/defaultMockOffers";
import { mockSubgraph } from "./mocks/mockGetBase";

const offersUrl = "/#/offers/";

const assertOfferDetail = async (expectedOffer: Offer, page: Page) => {
  const name = await page.locator("[data-testid=name]");
  await expect(name).toHaveText(
    expectedOffer.metadata?.name || "expected name"
  );

  const image = await page.locator("[data-testid=image]");
  await expect(image.getAttribute("src")).toBeTruthy();

  const description = await page.locator("[data-testid=description]");
  await expect(description).toHaveText(
    expectedOffer.metadata?.description || "Unexpected description"
  );

  const deliveryInfo = await page.locator("[data-testid=delivery-info]");
  await expect(deliveryInfo).toHaveText("Not defined");

  const profileImg = await page.locator("[data-testid=profileImg]");
  const svg = await profileImg.locator("svg");
  await expect(svg).toBeDefined();

  const sellerId = await page.locator("[data-testid=seller-id]");
  const expectedSellerId = "ID: " + expectedOffer.seller?.id || "Unexpected id";
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
    const noOffers = await page.locator(errorOfferSelector);
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
    const noOffers = await page.locator(notFoundSelector);
    await expect(noOffers).toHaveText("This offer does not exist");
  });
  test("should display an error if the offer does exist but is not valid", async ({
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
    const noOffers = await page.locator(notFoundSelector);
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
