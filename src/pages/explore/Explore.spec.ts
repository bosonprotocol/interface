import { expect, test } from "@playwright/test";
import {
  assertUrlToEqualQueryParam,
  queryParams
} from "lib/utils/test/assert/queryParams";
import { mockSubgraph } from "lib/utils/test/mocks/mockGetBase";
import { sortOffersBy } from "lib/utils/test/utils/sort";

import { assertOffer } from "../../lib/utils/test/assert/offer";
import { defaultMockOffers } from "../../lib/utils/test/mocks/defaultMockOffers";

const exploreUrl = "/#/explore";

test.describe("Explore page", () => {
  test.describe("Header & footer", () => {
    test.beforeEach(async ({ page }) => {
      await mockSubgraph({
        page
      });
      await page.goto(exploreUrl);
    });
    test("should display the title", async ({ page }) => {
      const h1 = await page.locator("h1", { hasText: "Explore" });

      await expect(h1).toBeDefined();
    });
    test("should display the logo", async ({ page }) => {
      const logoImg = await page.locator("[data-testid=logo]");

      await expect(await logoImg.getAttribute("src")).toBeTruthy();
    });
    test("should display the filter subheading", async ({ page }) => {
      const h2 = await page.locator("h2", { hasText: "Filter" });

      await expect(h2).toBeDefined();
    });
    test("should display the search subheading", async ({ page }) => {
      const h2 = await page.locator("h2", { hasText: "Search" });

      await expect(h2).toBeDefined();
    });
    test("should display the footer", async ({ page }) => {
      const footer = await page.locator("footer");

      await expect(footer).toBeDefined();
    });
    test.describe("Query params", () => {
      test("query param 'name' should update when changing input", async ({
        page
      }) => {
        const name = "name1";

        const input = await page.locator("input[data-testid=name]");

        await input.type(name, { delay: 100 });
        await input.press("Enter");

        await assertUrlToEqualQueryParam(page)("name", name);
      });
      test("query param 'currency' should update when changing select", async ({
        page
      }) => {
        const currencySelect = await page.locator(
          "select[data-testid=currency]"
        );
        const currency = "BOSON";
        await currencySelect.selectOption(currency);

        await assertUrlToEqualQueryParam(page)("currency", currency);
      });
      test("query param 'name' & 'currency' should update when changing input and then select", async ({
        page
      }) => {
        const name = "name1";

        const input = await page.locator("input[data-testid=name]");

        await input.type(name, { delay: 100 });
        await input.press("Enter");

        await assertUrlToEqualQueryParam(page)("name", name);

        const currencySelect = await page.locator(
          "select[data-testid=currency]"
        );
        const currency = "BOSON";
        await currencySelect.selectOption(currency);

        await assertUrlToEqualQueryParam(page)("currency", currency);
      });
      test("query param 'currency' & 'name' should update when changing select and then input", async ({
        page
      }) => {
        const currencySelect = await page.locator(
          "select[data-testid=currency]"
        );
        const currency = "BOSON";
        await currencySelect.selectOption(currency);

        await assertUrlToEqualQueryParam(page)("currency", currency);

        const name = "name1";

        const input = await page.locator("input[data-testid=name]");

        await input.type(name, { delay: 100 });
        await input.press("Enter");

        await assertUrlToEqualQueryParam(page)("name", name);
      });
      test("query param 'name' should update when changing input and clearing it again", async ({
        page
      }) => {
        const name = "name1";

        const input = await page.locator("input[data-testid=name]");

        await input.type(name, { delay: 100 });
        await input.press("Enter");

        await assertUrlToEqualQueryParam(page)("name", name);

        for (let i = 0; i < name.length; i++) {
          await input.press("Backspace");
        }
        await input.press("Enter");
        await assertUrlToEqualQueryParam(page)("name", "");
      });
      test("input and select should change when we navigate to Explore with their query params", async ({
        page
      }) => {
        const name = "name1";
        const currency = "BOSON";

        await page.goto(
          `${exploreUrl}?${queryParams.name}=${name}&${queryParams.currency}=${currency}`
        );
        await page.goto(
          `${exploreUrl}?${queryParams.name}=${name}&${queryParams.currency}=${currency}`
        );

        const input = await page.locator("input[data-testid=name]");
        const value = await input.inputValue();
        await expect(value).toStrictEqual(name);

        const currencySelect = await page.locator(
          "select[data-testid=currency]"
        );
        const valueSelect = await currencySelect.inputValue();
        await expect(valueSelect).toStrictEqual(currency);
      });
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
      await page.waitForTimeout(500);
      const offers = await page.locator("[data-testid=offer]");
      const offerCount = await offers.count();
      await expect(offerCount).toStrictEqual(mockedOffers.length - 1); // 1 invalid offer
    });

    test("should display the first 10 offers ordered by name ASC, without filters", async ({
      page
    }) => {
      const numberOfOffers = 10;
      const first10Offers = defaultMockOffers
        .map((offer) => ({ offer: { ...offer } }))
        .slice(0, numberOfOffers)
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
      await page.waitForTimeout(500);
      const offers = await page.locator("[data-testid=offer]");
      const offerCount = await offers.count();
      await expect(offerCount).toStrictEqual(first10Offers.length);

      for (let i = 0; i < offerCount; i++) {
        const offer = offers.nth(i);
        const expectedOffer = first10Offers[i].offer;
        await assertOffer(offer, expectedOffer);
      }
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

    test("should display error message when subgraph returns HTTP 400 error", async ({
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

    test("should display error message when subgraph returns HTTP 500 error", async ({
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
