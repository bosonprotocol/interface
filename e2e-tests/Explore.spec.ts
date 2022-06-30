import { Offer } from "../src/lib/types/offer";
import { assertOffer } from "./assert/offer";
import { assertUrlToEqualQueryParam, queryParams } from "./assert/queryParams";
import { assertUrlHashToEqual } from "./assert/urlParams";
import { expect, test } from "./baseFixtures";
import { mockSubgraph } from "./mocks/mockGetBase";
import { getFirstNOffers } from "./utils/getFirstNOffers";
import { sortOffersBy } from "./utils/sort";
import { DEFAULT_TIMEOUT } from "./utils/timeouts";

const exploreUrl = "/#/explore";
const offersPerPage = 11;
const visibleOffersPerPage = offersPerPage - 1;

test.describe("Explore page", () => {
  test.describe("Header & footer", () => {
    test.beforeEach(async ({ page }) => {
      await mockSubgraph({
        page
      });
      await page.goto(exploreUrl);
    });
    test("should display the title", async ({ page }) => {
      const h1 = page.locator("h1", { hasText: "Explore" });

      expect(h1).toBeDefined();
    });
    test("should display the filter subheading", async ({ page }) => {
      const h2 = page.locator("h2", { hasText: "Filter" });

      expect(h2).toBeDefined();
    });
    test("should display the search subheading", async ({ page }) => {
      const h2 = page.locator("h2", { hasText: "Search" });

      expect(h2).toBeDefined();
    });
    test.describe("Query params", () => {
      test("query param 'name' should update when changing input", async ({
        page
      }) => {
        const name = "name1";

        const input = page.locator("input[data-testid=name]");

        await input.type(name, { delay: 100 });
        await input.press("Enter");

        assertUrlToEqualQueryParam(page)("name", name);
      });
      test("query param 'currency' should update when changing select", async ({
        page
      }) => {
        const currencySelect = page.locator("select[data-testid=currency]");
        const currency = "BOSON";
        await currencySelect.selectOption(currency);

        assertUrlToEqualQueryParam(page)("currency", currency);
      });
      test("query param 'name' & 'currency' should update when changing input and then select", async ({
        page
      }) => {
        const name = "name1";

        const input = page.locator("input[data-testid=name]");

        await input.type(name, { delay: 100 });
        await input.press("Enter");

        assertUrlToEqualQueryParam(page)("name", name);

        const currencySelect = page.locator("select[data-testid=currency]");
        const currency = "BOSON";
        await currencySelect.selectOption(currency);

        assertUrlToEqualQueryParam(page)("currency", currency);
      });
      test("query param 'currency' & 'name' should update when changing select and then input", async ({
        page
      }) => {
        const currencySelect = page.locator("select[data-testid=currency]");
        const currency = "BOSON";
        await currencySelect.selectOption(currency);

        assertUrlToEqualQueryParam(page)("currency", currency);

        const name = "name1";

        const input = page.locator("input[data-testid=name]");

        await input.type(name, { delay: 100 });
        await input.press("Enter");

        assertUrlToEqualQueryParam(page)("name", name);
      });
      test("query param 'seller' should update when changing seller select", async ({
        page
      }) => {
        const sellerSelect = page.locator("select[data-testid=seller]");
        const sellerId = "1";

        await sellerSelect.selectOption(sellerId);

        assertUrlToEqualQueryParam(page)("seller", sellerId);
      });
      test("query param 'name' should update when changing input and clearing it again", async ({
        page
      }) => {
        const name = "name1";

        const input = page.locator("input[data-testid=name]");

        await input.type(name, { delay: 100 });
        await input.press("Enter");

        assertUrlToEqualQueryParam(page)("name", name);

        for (let i = 0; i < name.length; i++) {
          await input.press("Backspace");
        }
        await input.press("Enter");

        assertUrlToEqualQueryParam(page)("name", undefined);
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

        const input = page.locator("input[data-testid=name]");
        const value = await input.inputValue();
        expect(value).toStrictEqual(name);

        const currencySelect = page.locator("select[data-testid=currency]");
        const valueSelect = await currencySelect.inputValue();
        expect(valueSelect).toStrictEqual(currency);
      });
      test("that query params are kept when navigating between pages", async ({
        page
      }) => {
        const mockOffers = getFirstNOffers(20).map((offer) => ({
          ...offer
        }));
        const first10Offers = mockOffers.slice(0, offersPerPage);
        const second10Offers = mockOffers.slice(offersPerPage);

        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offersPerPage: {
                offersList: [first10Offers, second10Offers],
                countOffersPerPage: offersPerPage
              }
            }
          }
        });

        await page.goto(exploreUrl);
        await page.waitForTimeout(DEFAULT_TIMEOUT);
        const name = "name1";

        const input = page.locator("input[data-testid=name]");
        await input.type(name, { delay: 100 });
        await input.press("Enter", { delay: 100 });

        await assertUrlHashToEqual(page, `#/explore?name=${name}`);

        const nextButton = page.locator("[data-testid=next]");

        await nextButton.click();

        await assertUrlHashToEqual(page, `#/explore/page/2?name=${name}`);

        const previousButton = page.locator("[data-testid=previous]");

        await previousButton.click();

        await assertUrlHashToEqual(page, `#/explore?name=${name}`);
      });
      test("that applying a filter reverts the user to page 1", async ({
        page
      }) => {
        const mockOffers = getFirstNOffers(20).map((offer) => ({
          ...offer
        }));
        const first10Offers = mockOffers.slice(0, offersPerPage);
        const second10Offers = mockOffers.slice(offersPerPage);

        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offersPerPage: {
                offersList: [first10Offers, second10Offers],
                countOffersPerPage: offersPerPage
              }
            }
          }
        });

        await page.goto(exploreUrl);
        await page.waitForTimeout(DEFAULT_TIMEOUT);
        let name = "name1";

        const input = page.locator("input[data-testid=name]");
        await input.type(name, { delay: 100 });
        await input.press("Enter", { delay: 100 });

        await assertUrlHashToEqual(page, `#/explore?name=${name}`);

        const nextButton = page.locator("[data-testid=next]");

        await nextButton.click();

        await assertUrlHashToEqual(page, `#/explore/page/2?name=${name}`);

        for (let i = 0; i < name.length; i++) {
          await input.press("Delete");
        }

        name = "hello";
        await input.type(name, { delay: 100 });
        await input.press("Enter", { delay: 100 });

        await assertUrlHashToEqual(page, `#/explore?name=${name}`);
      });
    });
  });
  test.describe("Url params", () => {
    [
      "/#/offers",
      exploreUrl,
      `${exploreUrl}/page`,
      `${exploreUrl}/page/0`,
      `${exploreUrl}/page/1`
    ].map((currentUrl) => {
      test(`check that we see the first ${offersPerPage} offers if we go to ${currentUrl} (first page)`, async ({
        page
      }) => {
        const numberOfOffers = 17;

        const offers: Offer[] = await getFirstNOffers(numberOfOffers);

        const offers1stPage = offers.slice(0, offersPerPage);
        const offers2ndPage = offers.slice(offersPerPage);
        expect(offers2ndPage.length).toStrictEqual(
          numberOfOffers - offersPerPage
        );
        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offersPerPage: {
                offersList: [offers1stPage, offers2ndPage],
                countOffersPerPage: offersPerPage
              }
            }
          }
        });
        await page.goto(currentUrl);
        await page.waitForTimeout(DEFAULT_TIMEOUT);
        const uiOffers = page.locator("[data-testid=offer]");
        const offerCount = await uiOffers.count();
        expect(offerCount).toStrictEqual(visibleOffersPerPage);

        for (let i = 0; i < offerCount; i++) {
          const offer = uiOffers.nth(i);
          const expectedOffer = offers1stPage[i];
          await assertOffer(offer, expectedOffer);
        }
      });
    });
    [`${exploreUrl}/page/2`].map((currentUrl) => {
      test(`check that we see the second batch of offers if we go to ${currentUrl} (second page)`, async ({
        page
      }) => {
        const numberOfOffers = 17;

        const offers: Offer[] = await getFirstNOffers(numberOfOffers);
        const offers1stPage = offers.slice(0, offersPerPage);
        const offers2ndPage = offers.slice(offersPerPage);
        expect(offers2ndPage.length).toStrictEqual(
          numberOfOffers - offersPerPage
        );
        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offersPerPage: {
                offersList: [offers1stPage, offers2ndPage],
                countOffersPerPage: offersPerPage
              }
            }
          }
        });
        await page.goto(currentUrl);
        await page.waitForTimeout(DEFAULT_TIMEOUT);

        const uiOffers = page.locator("[data-testid=offer]");
        const offerCount = await uiOffers.count();
        expect(offerCount).toStrictEqual(offers2ndPage.length);

        for (let i = 0; i < offerCount; i++) {
          const offer = uiOffers.nth(i);
          const expectedOffer = offers2ndPage[i];
          await assertOffer(offer, expectedOffer);
        }
      });
    });
    test(`check that the url changes to /page/2 when clicking on the next button`, async ({
      page
    }) => {
      const numberOfOffers = 17;

      const offers: Offer[] = await getFirstNOffers(numberOfOffers);

      const offers1stPage = offers.slice(0, offersPerPage);
      const offers2ndPage = offers.slice(offersPerPage);
      expect(offers2ndPage.length).toStrictEqual(
        numberOfOffers - offersPerPage
      );
      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            offersPerPage: {
              offersList: [offers1stPage, offers2ndPage],
              countOffersPerPage: offersPerPage
            }
          }
        }
      });
      await page.goto(exploreUrl);
      await page.waitForTimeout(DEFAULT_TIMEOUT);

      const nextButton = page.locator("[data-testid=next]");

      await nextButton.click();

      await assertUrlHashToEqual(page, "#/explore/page/2");
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
      const mockedOffers = [{ ...getFirstNOffers(1)[0] }, invalidOffer].map(
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
      await page.waitForTimeout(DEFAULT_TIMEOUT);
      const offers = page.locator("[data-testid=offer]");
      const offerCount = await offers.count();
      expect(offerCount).toStrictEqual(mockedOffers.length - 1); // 1 invalid offer
    });

    test("should display the first 10 offers ordered by name ASC, without filters", async ({
      page
    }) => {
      const numberOfOffers = 10;
      const first10Offers = getFirstNOffers(numberOfOffers)
        .map((offer) => ({ offer: { ...offer } }))
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
      await page.waitForTimeout(DEFAULT_TIMEOUT);
      const offers = page.locator("[data-testid=offer]");
      const offerCount = await offers.count();
      expect(offerCount).toStrictEqual(first10Offers.length);

      for (let i = 0; i < offerCount; i++) {
        const offer = offers.nth(i);
        const expectedOffer = first10Offers[i].offer;
        await assertOffer(offer, expectedOffer);
      }
    });
    const numberOfOffers = 17;
    test(`should display ${visibleOffersPerPage} offers in the 1st page and ${
      numberOfOffers - visibleOffersPerPage
    } in the 2nd page`, async ({ page }) => {
      const offers: Offer[] = await getFirstNOffers(numberOfOffers);

      const offers1stPage = offers.slice(0, offersPerPage);
      const offers2ndPage = offers.slice(offersPerPage);
      expect(offers2ndPage.length).toStrictEqual(
        numberOfOffers - offersPerPage
      );

      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            offersPerPage: {
              offersList: [offers1stPage, offers2ndPage],
              countOffersPerPage: offersPerPage
            }
          }
        }
      });

      await page.goto(exploreUrl);
      await page.waitForTimeout(DEFAULT_TIMEOUT);

      let uiOffers = page.locator("[data-testid=offer]");
      let offerCount = await uiOffers.count();
      expect(offerCount).toStrictEqual(visibleOffersPerPage);

      for (let i = 0; i < offerCount; i++) {
        const offer = uiOffers.nth(i);
        const expectedOffer = offers[i];
        await assertOffer(offer, expectedOffer);
      }

      page.locator("[data-testid=previous]");
      const nextButton = page.locator("[data-testid=next]");

      await nextButton.click();
      await page.waitForTimeout(DEFAULT_TIMEOUT);
      uiOffers = page.locator("[data-testid=offer]");

      offerCount = await uiOffers.count();
      expect(offerCount).toStrictEqual(offers.length - offersPerPage);

      for (let i = 0; i < offerCount; i++) {
        const offer = uiOffers.nth(i);
        const expectedOffer = offers[offersPerPage + i];
        await assertOffer(offer, expectedOffer);
      }
    });

    test("should display there are no offers if we go to the explore page and there are no offers", async ({
      page
    }) => {
      await mockSubgraph({
        page,
        options: { mockGetOffers: { offers: [] } }
      });
      await page.goto(exploreUrl);
      const errorOffersSelector = "[data-testid=noOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText("No offers found");
    });

    test("should display there are no offers if we go to a random page with no offers", async ({
      page
    }) => {
      await mockSubgraph({
        page,
        options: { mockGetOffers: { offers: [] } }
      });
      await page.goto(`${exploreUrl}/page/23324234`);
      const errorOffersSelector = "[data-testid=noOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = page.locator(errorOffersSelector);
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
      await page.goto(exploreUrl);
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
      await page.goto(exploreUrl);
      const errorOffersSelector = "[data-testid=errorOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText(
        "There has been an error, please try again later..."
      );
    });
  });
});
