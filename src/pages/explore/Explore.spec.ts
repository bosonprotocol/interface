import { formatUnits } from "@ethersproject/units";
import { expect, Page, test } from "@playwright/test";
import { BigNumber } from "ethers";
import { graphqlEndpoint } from "lib/utils/test/environment";

const exploreUrl = "/#/explore";

test.describe("Explore page", () => {
  test.describe("Container", () => {
    test.beforeEach(async ({ page }) => {
      await mockSubgraph(page, { withOffers: true });
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
    const shortenAddress = (address: string): string => {
      if (!address) {
        return address;
      }
      return `${address.substring(0, 5)}...${address.substring(
        address.length - 4
      )}`;
    };
    test("should display the first 10 offers, without filters", async ({
      page
    }) => {
      await mockSubgraph(page, { withOffers: true });
      await page.goto(exploreUrl);

      const offers = await page.locator("[data-testid=offer]");

      for (let i = 0; i < 10; i++) {
        const offer = offers.nth(i);
        const expectedOffer = allOffers[i];
        const name = await offer.locator("[data-testid=name]");
        await expect(name).toHaveText(
          expectedOffer.metadata?.name || "expected name"
        );

        const sellerAdress = await offer.locator("[data-testid=sellerAdress]");
        const expectedSellerAddress = shortenAddress(
          expectedOffer.seller?.address || ""
        );

        await expect(sellerAdress).toHaveText(expectedSellerAddress);

        const price = await offer.locator("[data-testid=price]");
        const expectedPrice = `${formatUnits(
          BigNumber.from(expectedOffer.price),
          expectedOffer.exchangeToken?.decimals
        )} ${expectedOffer.exchangeToken?.symbol || ""}`;

        await expect(price).toHaveText(expectedPrice);

        const commit = await offer.locator("[data-testid=commit]");
        await expect(commit).toHaveText("Commit");

        const image = await offer.locator("[data-testid=image]");
        await expect(image.getAttribute("src")).toBeTruthy();

        const profileImg = await offer.locator("[data-testid=profileImg]");
        const svg = await profileImg.locator("svg");
        await expect(svg).toBeDefined();
      }
    });
    test("should display offers filtered by name=OfferV1", async ({ page }) => {
      const name = "OfferV1";
      await mockSubgraph(page, { name });
      await page.goto(exploreUrl);

      const input = await page.locator("input");
      await input.type(name, { delay: 100 });
      await input.press("Enter");

      const filteredOffers = allOffers
        .filter((offer) => offer?.metadata.name.includes(name))
        .map((offer) => ({
          offer
        }));

      const offers = await page.locator("[data-testid=offer]");

      const num = await offers.count();
      await expect(num).toBe(filteredOffers.length);
      for (let i = 0; i < num; i++) {
        const offer = offers.nth(i);
        const expectedOffer = filteredOffers[i].offer;
        const name = await offer.locator("[data-testid=name]");
        await expect(name).toHaveText(
          expectedOffer.metadata?.name || "expected name"
        );

        const sellerAdress = await offer.locator("[data-testid=sellerAdress]");
        const expectedSellerAddress = shortenAddress(
          expectedOffer.seller?.address || ""
        );

        await expect(sellerAdress).toHaveText(expectedSellerAddress);

        const price = await offer.locator("[data-testid=price]");
        const expectedPrice = `${formatUnits(
          BigNumber.from(expectedOffer.price),
          expectedOffer.exchangeToken?.decimals
        )} ${expectedOffer.exchangeToken?.symbol || ""}`;

        await expect(price).toHaveText(expectedPrice);

        const commit = await offer.locator("[data-testid=commit]");
        await expect(commit).toHaveText("Commit");

        const image = await offer.locator("[data-testid=image]");
        await expect(image.getAttribute("src")).toBeTruthy();

        const profileImg = await offer.locator("[data-testid=profileImg]");
        const svg = await profileImg.locator("svg");
        await expect(svg).toBeDefined();
      }
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

const allOffers = [
  {
    id: "0",
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
      description: "Description",
      type: "BASE"
    }
  },
  {
    id: "1",
    price: "1",
    seller: {
      address: "0x0000000000000000000000000000000000000000"
    },
    exchangeToken: {
      symbol: "BOSON",
      decimals: "2"
    },
    metadata: {
      name: "OfferV1 with id 1", // dont change, used in a test
      description: "Description"
    }
  },
  {
    id: "10",
    price: "1",
    seller: {
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      name: "Offer with id 10",
      description: "Description",
      type: "BASE"
    }
  },
  {
    id: "11",
    price: "1",
    seller: {
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      name: "offer with id 11",
      description: ""
    }
  },
  {
    id: "12",
    price: "1",
    seller: {
      address: "0x57fafe1fb7c682216fce44e50946c5249192b9d5"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      name: "offer with id 12",
      description: ""
    }
  },
  {
    id: "13",
    price: "1",
    seller: {
      address: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      name: "offer with id 13",
      description: ""
    }
  },
  {
    id: "14",
    price: "1",
    seller: {
      address: "0xd8bb0e340f1cb59909a4fb9de585cb203be37b8a"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      name: "offer with id 14",
      description: ""
    }
  },
  {
    id: "15",
    price: "100000000000000000",
    seller: {
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      name: "offer with id 15",
      description: ""
    }
  },
  {
    id: "16",
    price: "1000000000000000000",
    seller: {
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      name: "offer with id 16",
      description: ""
    }
  },
  {
    id: "17",
    price: "1000000000000000000",
    seller: {
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      name: "offer with id 17"
    }
  },
  {
    id: "18",
    price: "1000000000000000000",
    seller: {
      address: "0xe16955e95d088bd30746c7fb7d76cda436b86f63"
    },
    exchangeToken: {
      symbol: "ETH"
    },
    metadata: {
      name: "Baggy jeans",
      description: ""
    }
  }
];

const mockSubgraph = (
  page: Page,
  {
    withOffers,
    offers,
    response,
    name
  }: {
    withOffers?: boolean;
    offers?: Record<string, unknown>[];
    response?: Record<string, unknown>;
    name?: string;
  }
): Promise<void> =>
  page.route(graphqlEndpoint, (route) => {
    const postData = route.request().postData();
    const isBrandsReq = postData?.includes("productV1MetadataEntities");
    const isExchangeTokensReq = postData?.includes("exchangeTokens");
    const isOffersReq = postData?.includes("offers(");
    const isBaseEntitiesReq = postData?.includes("baseMetadataEntities(");
    let body;
    if (isBrandsReq) {
      body = {
        data: {
          productV1MetadataEntities: [
            {
              brandName: "brand1"
            },
            {
              brandName: "brand2"
            }
          ]
        }
      };
    } else if (isExchangeTokensReq) {
      body = {
        data: {
          exchangeTokens: [
            {
              symbol: "BOSON"
            }
          ]
        }
      };
    } else if (isOffersReq) {
      body = {
        data: {
          offers: withOffers ? allOffers : offers ? offers : []
        }
      };
    } else if (isBaseEntitiesReq) {
      const filterByName = postData?.includes("name_contains_nocase");
      const filteredOffers = allOffers
        .filter((offer) => offer?.metadata.name.includes(name!))
        .map((offer) => ({
          offer
        }));
      body = {
        data: {
          baseMetadataEntities: offers
            ? offers
            : withOffers
            ? allOffers.map((offer) => ({
                offer
              }))
            : filterByName
            ? filteredOffers
            : []
        }
      };
    } else {
      const error =
        "This request has not been mocked, plesease check your e2e test";
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
