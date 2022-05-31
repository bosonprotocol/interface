import { Offer } from "@lib/types/offer";
import { expect, test } from "@playwright/test";

import { assertOffer } from "./assert/offer";
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
  test.describe("tracing dropdown", () => {
    test("should display tracing dropdown when clicking on the settings icon", async ({
      page
    }) => {
      await mockSubgraph({
        page
      });
      await page.goto("/");
      const settings = page.locator("[data-testid=settings]");

      expect(settings).toBeDefined();

      await settings.click();

      const headerDropdown = page.locator("[data-testid=header-dropdown]");

      expect(headerDropdown).toBeDefined();
    });
    test("should close opened tracing dropdown when clicking on the settings icon", async ({
      page
    }) => {
      await mockSubgraph({
        page
      });
      await page.goto("/");
      const settings = page.locator("[data-testid=settings]");

      await expect(settings).toBeVisible();

      await settings.click();

      const headerDropdown = page.locator("[data-testid=header-dropdown]");

      await expect(headerDropdown).toBeVisible();

      await settings.click();

      await expect(headerDropdown).not.toBeVisible();
    });
    test("should display an error when typing a wrong url into the tracing url dropdown", async ({
      page
    }) => {
      await mockSubgraph({
        page
      });
      await page.goto("/");
      const settings = page.locator("[data-testid=settings]");

      await expect(settings).toBeVisible();

      await settings.click();

      const headerDropdown = page.locator("[data-testid=header-dropdown]");

      await expect(headerDropdown).toBeVisible();

      const input = await headerDropdown.locator("input");

      const wrongUrl = "blabla";
      await input.type(wrongUrl, { delay: 100 });

      const saveButton = headerDropdown.locator("[data-testid=save]");

      await saveButton.click();

      const errorDiv = headerDropdown.locator("[data-testid=error]");

      await expect(errorDiv).toHaveText(`Invalid Sentry Dsn: ${wrongUrl}`);
    });
    test("should send the offer url to sentry once the tracing url is set and you click on the offer commit button", async ({
      page
    }) => {
      const numberOfOffers = 10;

      const firstTenOffers = defaultMockOffers
        .map((offer) => ({
          offer: {
            ...offer
          }
        }))
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

      let pageNavigationCounter = 0;
      await page.route(
        "https://yyy.ingest.sentry.io/api/123/envelope/?sentry_key=XXX&sentry_version=7",
        async (route) => {
          const postData = route.request().postData();
          const data = postData?.split("\n");
          const jsonWithPathname = JSON.parse(data?.at(-1) || "");
          if (pageNavigationCounter === 0) {
            expect(jsonWithPathname.transaction).toBe(`/`);
          } else if (pageNavigationCounter === 1) {
            expect(jsonWithPathname.transaction).toBe(`/offers/:id`);
          } else {
            throw new Error("Unhandled navigation");
          }
          pageNavigationCounter++;
        }
      );
      await page.goto("/");
      await page.waitForTimeout(500);

      const settings = page.locator("[data-testid=settings]");

      await expect(settings).toBeVisible();

      await settings.click();

      const headerDropdown = page.locator("[data-testid=header-dropdown]");

      await expect(headerDropdown).toBeVisible();

      const input = headerDropdown.locator("input");

      const correctUrl = "https://XXX@YYY.ingest.sentry.io/123";
      await input.type(correctUrl, { delay: 100 });

      const saveButton = headerDropdown.locator("[data-testid=save]");

      await saveButton.click();

      const errorDiv = headerDropdown.locator("[data-testid=error]");
      await expect(errorDiv).not.toBeDisabled();

      const offers = page.locator("[data-testid=offer]");
      const firstOffer = offers.nth(0);

      const commitButton = firstOffer.locator('[data-testid="commit"]');
      await commitButton.click();

      await page.waitForTimeout(1000); // wait until the sentry expect is executed
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
