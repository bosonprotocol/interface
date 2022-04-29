import { offers } from "@bosonprotocol/core-sdk";
import { formatUnits } from "@ethersproject/units";
import { expect, Page, test } from "@playwright/test";
import { BigNumber } from "ethers";
import { graphqlEndpoint } from "lib/utils/test/environment";

import { assertOffer } from "../../lib/utils/test/assert/offer";
import { defaultMockOffers } from "../../lib/utils/test/mocks/defaultMockOffers";
import { mockGetBrands } from "../../lib/utils/test/mocks/mockGetBrands";
import { mockGetOffers } from "../../lib/utils/test/mocks/mockGetOffers";
import { mockGetTokens } from "../../lib/utils/test/mocks/mockGetTokens";

test.describe("Root page (Landing page)", () => {
  test.describe("Container", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/");
    });
    test("should have an h1 'Boson dApp'", async ({ page }) => {
      const h1 = await page.locator("h1");

      await expect(h1).toHaveText("Boson dApp");
    });
    test("should have a logo", async ({ page }) => {
      const logoImg = await page.locator("[data-testid=logo]");

      await expect(logoImg.getAttribute("src")).toBeTruthy();
    });
    test("should have an h2 'Featured Offers'", async ({ page }) => {
      const h2 = await page.locator("h2");

      await expect(h2).toHaveText("Featured Offers");
    });
    test("should have a footer", async ({ page }) => {
      const footer = await page.locator("footer");

      await expect(footer).toBeDefined();
    });
  });

  test.describe("Offers list", () => {
    test("should display the first 10 offers", async ({ page }) => {
      await mockGetOffers({ page });

      await page.goto("/");

      const offers = await page.locator("[data-testid=offer]");

      for (let i = 0; i < 10; i++) {
        const offer = offers.nth(i);
        const expectedOffer = defaultMockOffers[i];
        await assertOffer(offer, expectedOffer);
      }
    });

    test.skip("should filter out invalid offers", async ({ page }) => {
      const mockedOffers = [
        { ...defaultMockOffers[0] },
        {
          id: "9999",
          price: "1",
          seller: {
            address: "0x57fafe1fb7c682216fce44e50946c5249192b9d5"
          },
          exchangeToken: {
            symbol: "ETH",
            decimals: "18"
          },
          metadata: {
            name: "first offer",
            externalUrl: "invalid offer",
            type: "BASE"
            // missing description among other fields
          }
        }
      ];

      await mockGetOffers({ page, options: { offers: mockedOffers } });
      await page.goto("/");

      const offers = await page.locator("[data-testid=offer]");
      const offerCount = await offers.count();
      await expect(offerCount).toStrictEqual(mockedOffers.length - 1);
    });

    test("should display 'No offers found'", async ({ page }) => {
      await mockGetOffers({ page, options: { offers: [] } });
      await page.goto("/");
      const errorOffersSelector = "[data-testid=noOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = await page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText("No offers found");
    });

    test("should display 'There has been an error, please try again later...' if we get a 400 error", async ({
      page
    }) => {
      const response = {
        status: 400,
        body: JSON.stringify({
          data: {}
        }),
        contentType: "application/json"
      };
      await mockGetOffers({ page, options: { response } });

      await page.goto("/");
      const errorOffersSelector = "[data-testid=errorOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = await page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText(
        "There has been an error, please try again later..."
      );
    });

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

      await mockGetOffers({
        page,
        options: {
          response
        }
      });

      await page.goto("/");
      const errorOffersSelector = "[data-testid=errorOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = await page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText(
        "There has been an error, please try again later..."
      );
    });
  });
});
