import { formatUnits } from "@ethersproject/units";
import { expect, Page, test } from "@playwright/test";
import { BigNumber } from "ethers";
import { graphqlEndpoint } from "lib/utils/test/environment";

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
      const shortenAddress = (address: string): string => {
        if (!address) {
          return address;
        }
        return `${address.substring(0, 5)}...${address.substring(
          address.length - 4
        )}`;
      };
      await mockOffersApi(page, { withOffers: true });
      await page.goto("/");

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
    test("should display 'No offers found'", async ({ page }) => {
      await mockOffersApi(page, { withOffers: false });
      await page.goto("/");
      const errorOffersSelector = "[data-testid=noOffers]";
      await page.waitForSelector(errorOffersSelector);
      const noOffers = await page.locator(errorOffersSelector);
      await expect(noOffers).toHaveText("No offers found");
    });
    test("should display 'There has been an error, please try again later...' if we get a 400 error", async ({
      page
    }) => {
      await mockOffersApi(page, {
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
      await mockOffersApi(page, {
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
      description: "Description"
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
      name: "offer with id 1",
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
      name: "offer with id 10",
      description: ""
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

const mockOffersApi = (
  page: Page,
  {
    withOffers,
    response
  }: { withOffers?: boolean; response?: Record<string, unknown> }
) =>
  page.route(graphqlEndpoint, (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        data: {
          baseMetadataEntities: withOffers
            ? allOffers.map((offer) => ({
                offer
              }))
            : []
        }
      }),
      contentType: "application/json",
      ...response
    });
  });
