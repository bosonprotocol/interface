import { expect, test } from "@playwright/test";
import { Offer } from "lib/types/offer";
import { mockSubgraph } from "lib/utils/test/mocks/mockGetBase";
import { sortOffersBy } from "lib/utils/test/utils/sort";

import { assertOffer } from "../../lib/utils/test/assert/offer";
import { defaultMockOffers } from "../../lib/utils/test/mocks/defaultMockOffers";

test.describe("Root page (Landing page)", () => {
  test.describe("Container", () => {
    test.beforeEach(async ({ page }) => {
      await mockSubgraph({
        page
      });
      await page.goto("/");
    });
    test("should have an h1 'Boson dApp'", async ({ page }) => {
      const h1 = await page.locator("h1");

      await expect(h1).toHaveText("Boson dApp");
    });
    test("should have a logo", async ({ page }) => {
      const logoImg = await page.locator("[data-testid=logo]");

      await expect(await logoImg.getAttribute("src")).toBeTruthy();
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
      const nOffers = 10;
      const first10Offers = defaultMockOffers
        .map((offer) => ({ offer: { ...offer } }))
        .slice(0, nOffers)
        .sort(sortOffersBy({ property: "name", asc: true }));
      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            response: {
              body: JSON.stringify({
                data: { baseMetadataEntities: first10Offers }
              })
            }
          }
        }
      });

      await page.goto("/");

      await page.waitForTimeout(500);
      const offers = await page.locator("[data-testid=offer]");
      const num = await offers.count();

      await expect(num).toStrictEqual(nOffers);
      for (let i = 0; i < nOffers; i++) {
        const offer = offers.nth(i);
        const expectedOffer = first10Offers[i].offer;
        await page.pause();

        await assertOffer(offer, expectedOffer);
      }
    });

    test("should filter out invalid offers", async ({ page }) => {
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
      ].map((offer) => ({ offer })) as unknown as Offer[];

      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            response: {
              body: JSON.stringify({
                data: { baseMetadataEntities: mockedOffers }
              })
            }
          }
        }
      });
      await page.goto("/");
      await page.waitForTimeout(500);
      const offers = await page.locator("[data-testid=offer]");
      const offerCount = await offers.count();
      await expect(offerCount).toStrictEqual(mockedOffers.length - 1);
    });

    test("should display 'No offers found'", async ({ page }) => {
      await mockSubgraph({ page, options: { mockGetOffers: { offers: [] } } });
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
      await mockSubgraph({ page, options: { mockGetOffers: { response } } });

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

      await mockSubgraph({ page, options: { mockGetOffers: { response } } });

      await page.goto("/");
      const errorOffersSelector = "[data-testid=errorOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = await page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText(
        "There has been an error, please try again later..."
      );
    });

    test("should go to the offers detail page when clicking on the commit button", async ({
      page
    }) => {
      const expectedOffer = { ...defaultMockOffers[0] };
      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            offers: [expectedOffer]
          }
        }
      });

      await page.goto("/");

      await page.waitForTimeout(500);
      const offers = await page.locator("[data-testid=offer]");
      const num = await offers.count();

      await expect(num).toStrictEqual(1);
      const offer = offers.nth(0);
      const commit = await offer.locator("[data-testid=commit]");
      await commit.click();

      const url = await page.url();
      const { hash } = new URL(url);
      expect(hash).toStrictEqual(`#/offers/${expectedOffer.id}`);
    });
  });
});
