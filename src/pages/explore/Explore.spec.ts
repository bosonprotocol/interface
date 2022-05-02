import { expect, test } from "@playwright/test";
import { mockSubgraph } from "lib/utils/test/mocks/mockGetBase";
import { sortOffersBy } from "lib/utils/test/utils/sort";

import { assertOffer } from "../../lib/utils/test/assert/offer";
import { defaultMockOffers } from "../../lib/utils/test/mocks/defaultMockOffers";

const exploreUrl = "/#/explore";

test.describe("Explore page", () => {
  test.describe("Container", () => {
    test.beforeEach(async ({ page }) => {
      await mockSubgraph({
        page
      });
      await page.goto(exploreUrl);
    });
    test("should have an h1 'Explore'", async ({ page }) => {
      const h1 = await page.locator("h1", { hasText: "Explore" });

      await expect(h1).toBeDefined();
    });
    test("should have a logo", async ({ page }) => {
      const logoImg = await page.locator("[data-testid=logo]");

      await expect(await logoImg.getAttribute("src")).toBeTruthy();
    });
    test("should have an h2 'Filter'", async ({ page }) => {
      const h2 = await page.locator("h2", { hasText: "Filter" });

      await expect(h2).toBeDefined();
    });
    test("should have an h2 'Search'", async ({ page }) => {
      const h2 = await page.locator("h2", { hasText: "Search" });

      await expect(h2).toBeDefined();
    });
    test("should have a footer", async ({ page }) => {
      const footer = await page.locator("footer");

      await expect(footer).toBeDefined();
    });
  });
  test.describe("Offers list", () => {
    test("should filter out invalid offers", async ({ page }) => {
      const invalidOffer = {
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
      };
      const mockedOffers = [{ ...defaultMockOffers[0] }, invalidOffer].map(
        (offer) => ({ offer })
      );

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
      await page.goto(exploreUrl);
      await page.waitForTimeout(1000);
      const offers = await page.locator("[data-testid=offer]");
      const num = await offers.count();
      await expect(num).toStrictEqual(mockedOffers.length - 1); // 1 invalid offer
    });

    test("should display the first 10 offers ordered by name ASC, without filters", async ({
      page
    }) => {
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

      await page.goto(exploreUrl);

      const offers = await page.locator("[data-testid=offer]");
      const num = await offers.count();
      await expect(num).toStrictEqual(first10Offers.length);

      for (let i = 0; i < num; i++) {
        const offer = offers.nth(i);
        const expectedOffer = first10Offers[i].offer;
        await assertOffer(offer, expectedOffer);
      }
    });

    test("should update 'name' query param to name=OfferV1 when typing 'OfferV1' in the search input", async ({
      page
    }) => {
      const name = "OfferV1";
      await mockSubgraph({
        page
      });
      await page.goto(exploreUrl);

      const input = await page.locator("input");
      await input.type(name, { delay: 100 });
      await input.press("Enter");

      // Check 'name' query param
      const url = await page.url();
      const { hash } = new URL(url);
      const paramsObj = Object.fromEntries(
        new URLSearchParams(hash.substring(hash.indexOf("?")))
      );
      await expect(paramsObj.name).toStrictEqual(name);
    });

    test("should display No offers found", async ({ page }) => {
      await mockSubgraph({
        page,
        options: { mockGetOffers: { offers: [] } }
      });
      await page.goto("/");
      const errorOffersSelector = "[data-testid=noOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = await page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText("No offers found");
    });

    test("should display 'There has been an error, please try again later...' if we get a 400 error", async ({
      page
    }) => {
      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            response: {
              status: 400,
              body: JSON.stringify({
                data: {}
              }),
              contentType: "application/json"
            }
          }
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

    test("should display 'There has been an error, please try again later...' if we get a 500 error", async ({
      page
    }) => {
      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            response: {
              status: 500,
              body: JSON.stringify({
                data: {}
              }),
              contentType: "application/json"
            }
          }
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
