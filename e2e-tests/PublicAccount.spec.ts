import { Offer } from "../src/lib/types/offer";
import { assertOfferInPublicAccountPage } from "./assert/offer";
import { expect, test } from "./baseFixtures";
import { defaultMockOffers } from "./mocks/defaultMockOffers";
import { mockSubgraph } from "./mocks/mockGetBase";
import { formatAddress } from "./utils/address";
import { sortOffersBy } from "./utils/sort";
import { DEFAULT_TIMEOUT } from "./utils/timeouts";

const publicAccountUrl = "/#/account";
const anyAccountAddress = "0x9c2925a41d6FB1c6C8f53351634446B0b2E65e44";
const publicAccountUrl1 = `${publicAccountUrl}/${anyAccountAddress}`;

test.describe("Public Account page", () => {
  test.describe("Default info when no data", () => {
    test.beforeEach(async ({ page }) => {
      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            offers: []
          },
          mockGetExchanges: {
            response: {
              body: JSON.stringify({
                data: { exchanges: [] }
              })
            }
          }
        }
      });
      await page.goto(publicAccountUrl1);
    });
    test("should display the profile avatar", async ({ page }) => {
      const profileImgContainer = page.locator("[data-testid=avatar]");
      const profileEnsImg = page.locator("[data-testid=ens-avatar]");
      if (await profileEnsImg.isVisible()) {
        expect(await profileEnsImg.getAttribute("src")).toBeTruthy();
      } else {
        const svg = profileImgContainer.locator("svg");
        const rects = svg.locator("rect");
        await page.waitForTimeout(DEFAULT_TIMEOUT);
        expect(await rects.count()).toBe(3);
      }
    });
    test("should display the address shortened", async ({ page }) => {
      const addressNode = page.locator("[data-testid=address]");
      const addressUI = await addressNode.textContent();
      await expect(addressUI).toBe(formatAddress(anyAccountAddress));
    });
    test.describe("offers tab", () => {
      test("should display the Offers tab", async ({ page }) => {
        const tab = page.locator("[data-testid=tab-Offers]");
        await expect(tab).toHaveText("Offers");
      });
      test("should display 'No offers found' as offers is the default selected tab", async ({
        page
      }) => {
        const noOffersText = page.locator("text=No offers found");
        await expect(noOffersText).toBeVisible();
      });
    });
    test.describe("exchanges tab", () => {
      test("should display the Exchanges tab", async ({ page }) => {
        const tab = page.locator("[data-testid=tab-Exchanges]");
        await expect(tab).toHaveText("Exchanges");
      });
      test("should display 'There are no exchanges' after clicking on the Exchanges tab", async ({
        page
      }) => {
        const tab = page.locator("[data-testid=tab-Exchanges]");
        await tab.click();
        const noExchangesText = page.locator("text=There are no exchanges");
        await expect(noExchangesText).toBeVisible();
      });
    });
    test.describe("disputes tab", () => {
      test("should display the Disputes tab", async ({ page }) => {
        const tab = page.locator("[data-testid=tab-Disputes]");
        await expect(tab).toHaveText("Disputes");
      });
      test("should display 'There are no disputes' after clicking on the Disputes tab", async ({
        page
      }) => {
        const tab = page.locator("[data-testid=tab-Disputes]");
        await tab.click();
        const noDisputesText = page.locator("text=There are no disputes");
        await expect(noDisputesText).toBeVisible();
      });
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

      await page.goto(publicAccountUrl1);

      await page.waitForTimeout(DEFAULT_TIMEOUT);
      const offers = page.locator("[data-testid=offer]");
      const offersCount = await offers.count();

      expect(offersCount).toStrictEqual(numberOfOffers);
      for (let i = 0; i < numberOfOffers; i++) {
        const offer = offers.nth(i);
        const expectedOffer = firstTenOffers[i].offer;
        await assertOfferInPublicAccountPage(offer, expectedOffer);
      }
    });

    test.skip("test that when you click on Offers and scroll, more offers are lazy loaded (via infinite scrolling)", async () => {
      throw new Error("TODO");
    });

    test.skip("should include/or filter out? invalid offers", async ({
      page
    }) => {
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
          name: "invalid offer",
          externalUrl: "invalid offer",
          type: "BASE"
          // missing description among other fields
        }
      };
      const mockedOffers = [
        invalidOffer,
        ...defaultMockOffers.slice(0, 10)
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

      await page.goto(publicAccountUrl1);
      await page.waitForTimeout(DEFAULT_TIMEOUT);
      const offers = await page.locator("[data-testid=offer]");
      const offerCount = await offers.count();
      expect(offerCount).toStrictEqual(mockedOffers.length - 1);
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

      await page.goto(publicAccountUrl1);

      await page.waitForTimeout(DEFAULT_TIMEOUT);
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

    test("should navigate to the offer detail page when clicking on the offer image", async ({
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

      await page.goto(publicAccountUrl1);

      await page.waitForTimeout(DEFAULT_TIMEOUT);
      const offers = page.locator("[data-testid=offer]");
      const offerCount = await offers.count();
      expect(offerCount).toStrictEqual(1);

      const offer = offers.nth(0);
      const image = offer.locator("[data-testid=image]");
      await image.click();

      const url = await page.url();
      const { hash } = new URL(url);
      expect(hash).toStrictEqual(`#/offers/${expectedOffer.id}`);
    });

    test.describe("Error cases", () => {
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

        await page.goto(publicAccountUrl1);
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

        await page.goto(publicAccountUrl1);
        const errorOffersSelector = "[data-testid=errorOffers]";
        await page.waitForSelector(errorOffersSelector);
        const noOffers = await page.locator(errorOffersSelector);
        await expect(noOffers).toHaveText(
          "There has been an error, please try again later..."
        );
      });
    });
  });
});
