import { Offer } from "@lib/types/offer";
import { expect, test } from "@playwright/test";

import { assertOffer } from "./assert/offer";
import { assertUrlToEqualQueryParam, queryParams } from "./assert/queryParams";
import { assertUrlHashToEqual } from "./assert/urlParams";
import { defaultMockOffers } from "./mocks/defaultMockOffers";
import { mockSubgraph } from "./mocks/mockGetBase";
import { sortOffersBy } from "./utils/sort";

const exploreUrl = "/#/explore";
const offersPerPage = 10;

const getFirstNOffers = async (numberOfOffers: number): Promise<Offer[]> => {
  let maxOfferId = 0;
  const offers: Offer[] = [
    ...defaultMockOffers.map((offer) => {
      maxOfferId = Math.max(maxOfferId, Number(offer.id));
      return { ...offer };
    }),
    ...Array(Math.max(0, numberOfOffers - defaultMockOffers.length))
      .fill(0)
      .map((_v, idx) => {
        const id = `${maxOfferId + idx}`;
        return {
          ...defaultMockOffers[0],
          id,
          seller: {
            ...defaultMockOffers[0].seller,
            id
          }
        };
      })
  ].slice(0, numberOfOffers);
  await expect(offers.length).toStrictEqual(numberOfOffers);
  return offers;
};

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
      test("query param 'seller' should update when changing seller select", async ({
        page
      }) => {
        const sellerSelect = await page.locator("select[data-testid=seller]");
        const sellerId = "1";

        await sellerSelect.selectOption(sellerId);

        await assertUrlToEqualQueryParam(page)("seller", sellerId);
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
      test("that query params are kept when navigating between pages", async ({
        page
      }) => {
        const mockOffers = defaultMockOffers.map((offer) => ({
          ...offer
        }));
        const first10Offers = mockOffers.slice(0, 10);
        const second10Offers = mockOffers.slice(0, 10);

        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offersPerPage: [first10Offers, second10Offers]
            }
          }
        });

        await page.goto(exploreUrl);
        await page.waitForTimeout(500);
        const name = "name1";

        const input = await page.locator("input[data-testid=name]");
        await input.type(name, { delay: 100 });
        await input.press("Enter", { delay: 100 });

        await assertUrlHashToEqual(page, `#/explore?name=${name}`);

        const nextButton = await page.locator("[data-testid=next]");

        await nextButton.click();

        await assertUrlHashToEqual(page, `#/explore/page/2?name=${name}`);

        const previousButton = await page.locator("[data-testid=previous]");

        await previousButton.click();

        await assertUrlHashToEqual(page, `#/explore?name=${name}`);
      });
      test("that applying a filter reverts the user to page 1", async ({
        page
      }) => {
        const mockOffers = defaultMockOffers.map((offer) => ({
          ...offer
        }));
        const first10Offers = mockOffers.slice(0, 10);
        const second10Offers = mockOffers.slice(0, 10);

        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offersPerPage: [first10Offers, second10Offers]
            }
          }
        });

        await page.goto(exploreUrl);
        await page.waitForTimeout(500);
        let name = "name1";

        const input = await page.locator("input[data-testid=name]");
        await input.type(name, { delay: 100 });
        await input.press("Enter", { delay: 100 });

        await assertUrlHashToEqual(page, `#/explore?name=${name}`);

        const nextButton = await page.locator("[data-testid=next]");

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
        await expect(offers2ndPage.length).toStrictEqual(
          numberOfOffers - offersPerPage
        );
        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offersPerPage: [offers1stPage, offers2ndPage],
              countOffersPerPage: offersPerPage
            }
          }
        });
        await page.goto(currentUrl);
        await page.waitForTimeout(500);
        const uiOffers = await page.locator("[data-testid=offer]");
        const offerCount = await uiOffers.count();
        await expect(offerCount).toStrictEqual(offers1stPage.length);

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
        await expect(offers2ndPage.length).toStrictEqual(
          numberOfOffers - offersPerPage
        );
        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offersPerPage: [offers1stPage, offers2ndPage],
              countOffersPerPage: offersPerPage
            }
          }
        });
        await page.goto(currentUrl);
        await page.waitForTimeout(500);

        const uiOffers = await page.locator("[data-testid=offer]");
        const offerCount = await uiOffers.count();
        await expect(offerCount).toStrictEqual(offers2ndPage.length);

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
      await expect(offers2ndPage.length).toStrictEqual(
        numberOfOffers - offersPerPage
      );
      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            offersPerPage: [offers1stPage, offers2ndPage],
            countOffersPerPage: offersPerPage
          }
        }
      });
      await page.goto(exploreUrl);
      await page.waitForTimeout(500);

      const nextButton = await page.locator("[data-testid=next]");

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
    const numberOfOffers = 17;
    test(`should display ${offersPerPage} offers in the 1st page and ${
      numberOfOffers - offersPerPage
    } in the 2nd page`, async ({ page }) => {
      const offers: Offer[] = await getFirstNOffers(numberOfOffers);

      const offers1stPage = offers.slice(0, offersPerPage);
      const offers2ndPage = offers.slice(offersPerPage);
      await expect(offers2ndPage.length).toStrictEqual(
        numberOfOffers - offersPerPage
      );

      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            offersPerPage: [offers1stPage, offers2ndPage],
            countOffersPerPage: offersPerPage
          }
        }
      });

      await page.goto(exploreUrl);
      await page.waitForTimeout(500);

      let uiOffers = await page.locator("[data-testid=offer]");

      let offerCount = await uiOffers.count();
      await expect(offerCount).toStrictEqual(offersPerPage);

      for (let i = 0; i < offerCount; i++) {
        const offer = uiOffers.nth(i);
        const expectedOffer = offers[i];
        await assertOffer(offer, expectedOffer);
      }

      await page.locator("[data-testid=previous]");
      const nextButton = await page.locator("[data-testid=next]");

      await nextButton.click();
      await page.waitForTimeout(500);
      uiOffers = await page.locator("[data-testid=offer]");

      offerCount = await uiOffers.count();
      await expect(offerCount).toStrictEqual(offers.length - offersPerPage);

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
      const noOffers = await page.locator(errorOffersSelector);
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
      await page.goto(exploreUrl);
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
      await page.goto(exploreUrl);
      const errorOffersSelector = "[data-testid=errorOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = await page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText(
        "There has been an error, please try again later..."
      );
    });
  });
});
