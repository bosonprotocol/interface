import { expect, Page, test } from "@playwright/test";
import { graphqlEndpoint } from "lib/utils/test/environment";

import { assertOffer } from "../../lib/utils/test/assert/offer";
import { defaultMockOffers } from "../../lib/utils/test/mocks/defaultMockOffers";
import { mockGetBrands } from "../../lib/utils/test/mocks/mockGetBrands";
import { mockGetOffers } from "../../lib/utils/test/mocks/mockGetOffers";
import { mockGetTokens } from "../../lib/utils/test/mocks/mockGetTokens";

const exploreUrl = "/#/explore";

test.describe.only("Explore page", () => {
  test.describe("Container", () => {
    test.beforeEach(async ({ page }) => {
      // await mockSubgraph(page, { withOffers: true });
      await mockGetBrands(page);
      await mockGetTokens(page);
      await mockGetOffers({ page });
      await page.goto(exploreUrl);
    });
    test("should have an h1 'Explore'", async ({ page }) => {
      const h1 = await page.locator("h1", { hasText: "Explore" });

      await expect(h1).toBeDefined();
    });
    test("should have a logo", async ({ page }) => {
      const logoImg = await page.locator("[data-testid=logo]");

      await expect(logoImg.getAttribute("src")).toBeTruthy();
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
    test.skip("should filter out invalid offers", async ({ page }) => {
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
      const mockedOffers = [{ ...defaultMockOffers[0] }, invalidOffer];

      await mockGetBrands(page);
      await mockGetTokens(page);
      await mockGetOffers({ page, options: { offers: mockedOffers } });
      await page.goto(exploreUrl);

      const offers = await page.locator("[data-testid=offer]");
      const num = await offers.count();
      await expect(num).toStrictEqual(mockedOffers.length - 1); // 1 invalid offer
    });

    test("should display the first 10 offers ordered by name ASC, without filters", async ({
      page
    }) => {
      await mockGetBrands(page);
      await mockGetTokens(page);
      await mockGetOffers({ page });

      await page.goto(exploreUrl);

      const offers = await page.locator("[data-testid=offer]");

      for (let i = 0; i < 10; i++) {
        const offer = offers.nth(i);
        const expectedOffer = defaultMockOffers[i];
        await assertOffer(offer, expectedOffer);
      }
    });

    test.only("should display offers filtered by name=OfferV1 & update 'name' query param", async ({
      page
    }) => {
      const name = "OfferV1";
      await mockGetBrands(page);
      await mockGetTokens(page);
      await mockGetOffers({
        page,
        options: {
          filterBy: {
            property: "name_contains_nocase",
            value: name
          }
        }
      });
      await page.goto(exploreUrl);

      await page.pause();
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

      // const filteredOffers = defaultMockOffers
      //   .filter((offer) => offer?.metadata.name.includes(name))
      //   .map((offer) => ({
      //     offer
      //   }));
      //
      // const offers = await page.locator("[data-testid=offer]");
      //
      // const num = await offers.count();
      // await expect(num).toStrictEqual(filteredOffers.length);
      // for (let i = 0; i < num; i++) {
      //   const offer = offers.nth(i);
      //   const expectedOffer = filteredOffers[i].offer;
      //   await assertOffer(offer, expectedOffer);
      // }
    });

    test("should display No offers found", async ({ page }) => {
      await mockSubgraph(page, { withOffers: false });
      await page.goto("/");
      const errorOffersSelector = "[data-testid=noOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = await page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText("No offers found");
    });

    test("should display 'There has been an error, please try again later...' if we get a 400 error", async ({
      page
    }) => {
      await mockSubgraph(page, {
        response: {
          status: 400,
          body: JSON.stringify({
            data: {}
          }),
          contentType: "application/json"
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
      await mockSubgraph(page, {
        response: {
          status: 500,
          body: JSON.stringify({
            data: {}
          }),
          contentType: "application/json"
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

const mockSubgraph = (
  page: Page,
  {
    withOffers,
    offers,
    response,
    orderBy,
    filterBy
  }: {
    withOffers?: boolean;
    offers?: Record<string, unknown>[];
    response?: Record<string, unknown>;
    orderBy?: {
      property: string;
      order: "asc" | "desc";
    };
    filterBy?: {
      property: string;
      condition: string;
    };
  }
): Promise<void> =>
  page.route(graphqlEndpoint, async (route) => {
    const postData = route.request().postData();
    const isBaseEntitiesReq = postData?.includes("baseMetadataEntities(");
    const filterByName =
      filterBy?.condition === "name_contains_nocase" &&
      postData?.includes(filterBy.condition);

    let body;
    if (isBaseEntitiesReq) {
      let offersToReturn: unknown[] = [];
      if (offers) {
        offersToReturn = offers;
      } else if (withOffers) {
        offersToReturn = defaultMockOffers.map((offer) => ({
          offer
        }));
      } else if (filterBy) {
        if (filterByName) {
          const name = filterBy.property;
          offersToReturn = defaultMockOffers
            .filter((offer) => offer?.metadata.name.includes(name))
            .map((offer) => ({
              offer
            }));
        }
      }

      if (orderBy) {
        const { property, order } = orderBy;
        // Check we actually ask the results to be ordered

        await expect(postData?.includes(`orderBy: ${property}`)).toBeTruthy();

        await expect(
          postData?.includes(`orderDirection: ${order}`)
        ).toBeTruthy();
      }

      body = {
        data: {
          baseMetadataEntities: offersToReturn
        }
      };
    } else {
      const error =
        "This request has not been mocked, please check your e2e test";
      // reject(error);
      return route.abort(error);
    }
    const options = {
      status: 200,
      body: JSON.stringify(body),
      contentType: "application/json",
      ...response
    };
    route.fulfill(options);
    // resolve({ reqPostData: postData, response: options });
  });

export interface CustomResponse {
  status: number;
  body: string;
  contentType: string;
}

export interface MockProps {
  page: Page;
  options?: {
    offers?: Record<string, unknown>[];
    response?: CustomResponse;
    filterBy?: {
      value: string;
      property: string;
    };
  };
}
