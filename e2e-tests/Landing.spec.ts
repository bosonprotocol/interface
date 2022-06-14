import { Offer } from "../src/lib/types/offer";
import { assertOffer } from "./assert/offer";
import { expect, test } from "./baseFixtures";
import { defaultMockOffers } from "./mocks/defaultMockOffers";
import { mockSubgraph } from "./mocks/mockGetBase";
import { sortOffersBy } from "./utils/sort";

test.describe("Root page (Landing page)", () => {
  test.describe("Header & footer", () => {
    test.beforeEach(async ({ page }) => {
      await mockSubgraph({
        page
      });
      await page.goto("/");
    });
    test("should display the title", async ({ page }) => {
      const h1 = page.locator("h1");

      await expect(h1).toHaveText("Boson dApp");
    });
    test("should display the logo", async ({ page }) => {
      const logoImg = page.locator("[data-testid=logo]");

      expect(await logoImg.getAttribute("src")).toBeTruthy();
    });
    test("should display the featured offers title", async ({ page }) => {
      const h2 = page.locator("h2");

      await expect(h2).toHaveText("Featured Offers");
    });
    test("should display the footer", async ({ page }) => {
      const footer = page.locator("footer");

      expect(footer).toBeDefined();
    });
  });
  test.describe("Offers list", () => {
    test("should display the first 10 offers", async ({ page }) => {
      const numberOfOffers = 10;
      const firstTenOffers = defaultMockOffers
        .map((offer) => ({ offer: { ...offer } }))
        .slice(0, numberOfOffers)
        .sort(sortOffersBy({ property: "name", asc: true }));

      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            response: {
              body: JSON.stringify({
                data: { baseMetadataEntities: firstTenOffers }
              })
            }
          }
        }
      });

      await page.goto("/");

      await page.waitForTimeout(500);
      const offers = page.locator("[data-testid=offer]");
      const offersCount = await offers.count();

      expect(offersCount).toStrictEqual(numberOfOffers);
      for (let i = 0; i < numberOfOffers; i++) {
        const offer = offers.nth(i);
        const expectedOffer = firstTenOffers[i].offer;

        await assertOffer(offer, expectedOffer);
      }
    });

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
      ) as unknown as Offer[];

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
      expect(offerCount).toStrictEqual(mockedOffers.length - 1);
    });

    test("should display error message when no available offers", async ({
      page
    }) => {
      await mockSubgraph({ page, options: { mockGetOffers: { offers: [] } } });
      await page.goto("/");
      const errorOffersSelector = "[data-testid=noOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = await page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText("No offers found");
    });

    test("should display error message when subgraph returns HTTP 400 error", async ({
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
      const noOffers = page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText(
        "There has been an error, please try again later..."
      );
    });

    test("should display error message when subgraph returns HTTP 500 error", async ({
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

    test("should navigate to the offer detail page when clicking on the commit button", async ({
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
      const offers = page.locator("[data-testid=offer]");
      const offerCount = await offers.count();

      expect(offerCount).toStrictEqual(1);
      const offer = offers.nth(0);
      const commit = offer.locator("[data-testid=commit]");
      await commit.click();

      const url = await page.url();
      const { hash } = new URL(url);
      expect(hash).toStrictEqual(`#/offers/${expectedOffer.id}`);
    });
  });
});
