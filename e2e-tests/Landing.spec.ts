import { Offer } from "../src/lib/types/offer";
import { assertOffer } from "./assert/offer";
import { assertUrlHashToEqual } from "./assert/urlParams";
import { expect, test } from "./baseFixtures";
import { mockSubgraph } from "./mocks/mockGetBase";
import { getFirstNOffers } from "./utils/getFirstNOffers";
import { sortOffersBy } from "./utils/sort";
import { DEFAULT_TIMEOUT } from "./utils/timeouts";

test.describe("Root page (Landing page)", () => {
  test.describe("Header & body & footer", () => {
    test.beforeEach(async ({ page }) => {
      await mockSubgraph({
        page
      });
      await page.goto("/");
    });
    test.describe("Header", () => {
      test("should display the logo in the header", async ({ page }) => {
        const headerLogoImg = page.locator("header img[data-testid=logo]");
        await page.pause();
        expect(await headerLogoImg.getAttribute("src")).toBeTruthy();
      });

      test("should type something in the input to search offers, press Enter and go to Explore", async ({
        page
      }) => {
        const name = "hello";
        const input = page.locator("input[data-testid=search-by-name-input]");
        await input.type(name, { delay: 100 });
        await input.press("Enter");

        await assertUrlHashToEqual(page, `#/explore?name=${name}`);
      });

      test("should type nothing in the input to search offers, press Enter and go to Explore", async ({
        page
      }) => {
        const input = page.locator("input[data-testid=search-by-name-input]");
        await input.press("Enter");

        await assertUrlHashToEqual(page, `#/explore`);
      });
    });
    test.describe("Body", () => {
      test("should display the title", async ({ page }) => {
        const h1 = page.locator("h1");

        await expect(h1).toHaveText(
          "Tokenize, transfer and trade any physical asset as an NFT"
        );
      });

      test("should display the 'Hot products', 'Almost gone' and 'Coming soon...'", async ({
        page
      }) => {
        const h3 = page.locator("h3");

        await expect(h3.nth(0)).toHaveText("Hot products");
        await expect(h3.nth(1)).toHaveText("Almost gone");
        await expect(h3.nth(2)).toHaveText("Coming soon...");
      });
      test("should click on the Explore all offers button and go to Explore", async ({
        page
      }) => {
        const goButton = page.locator("button[data-testid=explore-all-offers]");
        await goButton.click();

        await assertUrlHashToEqual(page, `#/explore`);
      });
    });
    test.describe("Footer", () => {
      test("should display the footer", async ({ page }) => {
        const footer = page.locator("footer");

        expect(footer).toBeDefined();
      });
      test("should display the logo in the footer", async ({ page }) => {
        const footerLogoImg = page.locator("footer img[data-testid=logo]");

        expect(await footerLogoImg.getAttribute("src")).toBeTruthy();
      });
    });
  });
  test.describe("Offers", () => {
    test("Carousel should display 8 offers (the max)", async ({ page }) => {
      const numberOfOffersInCarousel = 8;
      const firstTenOffers = getFirstNOffers(numberOfOffersInCarousel).sort(
        sortOffersBy({ property: "name", asc: true })
      );

      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            offers: firstTenOffers
          }
        }
      });

      await page.goto("/");

      await page.waitForTimeout(DEFAULT_TIMEOUT);

      const offers = page.locator("[data-testid=carousel] [data-testid=offer]");
      const offersCount = await offers.count();

      expect(offersCount).toStrictEqual(numberOfOffersInCarousel);
      for (let i = 0; i < numberOfOffersInCarousel; i++) {
        const offer = offers.nth(i);
        const expectedOffer = firstTenOffers[i];

        await assertOffer(offer, expectedOffer);
        const banner = offer.locator("[data-testid=offer-banner]");
        expect(banner).not.toBeVisible();
      }
    });

    test("Carousel arrows should change the selected offer", async ({
      page
    }) => {
      const numberOfOffersInCarousel = 8;
      const firstTenOffers = getFirstNOffers(numberOfOffersInCarousel).sort(
        sortOffersBy({ property: "name", asc: true })
      );

      await mockSubgraph({
        page,
        options: {
          mockGetOffers: {
            offers: firstTenOffers
          }
        }
      });

      await page.goto("/");

      await page.waitForTimeout(DEFAULT_TIMEOUT);

      const carouselPreviousButton = page.locator(
        "[data-testid=carousel-previous]"
      );
      const carouselNextButton = page.locator("[data-testid=carousel-next]");

      const selectedOffer = page.locator(
        "[data-testid=carousel] [data-current=true]"
      );

      const selectedOfferName = await selectedOffer
        .locator("[data-testid=name]")
        .textContent();
      await page.pause();

      await carouselNextButton.click();

      const nextSelectedOffer = page.locator(
        "[data-testid=carousel] [data-current=true]"
      );

      const nextSelectedOfferName = await nextSelectedOffer
        .locator("[data-testid=name]")
        .textContent();

      expect(selectedOfferName).not.toBe(nextSelectedOfferName);

      await carouselPreviousButton.click();

      const previousSelectedOffer = page.locator(
        "[data-testid=carousel] [data-current=true]"
      );

      const previousSelectedOfferName = await previousSelectedOffer
        .locator("[data-testid=name]")
        .textContent();

      expect(selectedOfferName).toBe(previousSelectedOfferName);
    });

    ["hot", "gone", "soon"].forEach((offersType) => {
      test(`should filter out invalid offers (${offersType} offers)`, async ({
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
            name: "first offer",
            externalUrl: "invalid offer",
            type: "BASE"
            // missing description among other fields
          }
        };
        const mockedOffers = [{ ...getFirstNOffers(1)[0] }, invalidOffer].map(
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
        await page.waitForTimeout(DEFAULT_TIMEOUT);
        const offers = await page.locator(
          `[data-testid=${offersType}] [data-testid=offer]`
        );
        const offerCount = await offers.count();
        expect(offerCount).toStrictEqual(mockedOffers.length - 1);
      });
      test(`should display error message when no available offers (${offersType} offers)`, async ({
        page
      }) => {
        await mockSubgraph({
          page,
          options: { mockGetOffers: { offers: [] } }
        });
        await page.goto("/");
        const errorOffersSelector = `[data-testid=${offersType}] [data-testid=noOffers]`;
        await page.waitForSelector(errorOffersSelector);
        const noOffers = await page.locator(errorOffersSelector);
        await expect(noOffers).toHaveText("No products found");
      });
      test(`should navigate to the seller account page when clicking on the seller section (${offersType} offers)`, async ({
        page
      }) => {
        const expectedOffer = { ...getFirstNOffers(1)[0] };
        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offers: [expectedOffer]
            }
          }
        });

        await page.goto("/");

        await page.waitForTimeout(DEFAULT_TIMEOUT);
        const offers = page.locator(
          `[data-testid=${offersType}] [data-testid=offer]`
        );
        const offerCount = await offers.count();
        expect(offerCount).toStrictEqual(1);

        const offer = offers.nth(0);
        const sellerSection = offer.locator("[data-testid=seller-id]");
        await sellerSection.click();

        const url = await page.url();
        const { hash } = new URL(url);
        expect(hash).toStrictEqual(
          `#/account/${expectedOffer.seller.operator}`
        );
      });

      test(`should navigate to the offer detail page when clicking on the offer image (${offersType} offers)`, async ({
        page
      }) => {
        const expectedOffer = { ...getFirstNOffers(1)[0] };
        await mockSubgraph({
          page,
          options: {
            mockGetOffers: {
              offers: [expectedOffer]
            }
          }
        });

        await page.goto("/");

        await page.waitForTimeout(DEFAULT_TIMEOUT);
        const offers = page.locator(
          `[data-testid=${offersType}] [data-testid=offer]`
        );
        const offerCount = await offers.count();
        expect(offerCount).toStrictEqual(1);

        const offer = offers.nth(0);
        const image = offer.locator("[data-testid=offerImage]");
        await image.click();

        const url = await page.url();
        const { hash } = new URL(url);
        expect(hash).toStrictEqual(`#/offers/${expectedOffer.id}`);
      });
      test.describe(`(${offersType} offers) Error cases`, () => {
        test(`should display error message when subgraph returns HTTP 400 error (${offersType} offers)`, async ({
          page
        }) => {
          const response = {
            status: 400,
            body: JSON.stringify({
              data: {}
            }),
            contentType: "application/json"
          };
          await mockSubgraph({
            page,
            options: { mockGetOffers: { response } }
          });

          await page.goto("/");
          const errorOffersSelector = `[data-testid=${offersType}] [data-testid=errorOffers]`;
          await page.waitForSelector(errorOffersSelector);
          const noOffers = page.locator(errorOffersSelector);
          await expect(noOffers).toHaveText(
            "There has been an error, please try again later..."
          );
        });

        test(`should display error message when subgraph returns HTTP 500 error (${offersType} offers)`, async ({
          page
        }) => {
          const response = {
            status: 500,
            body: JSON.stringify({
              data: {}
            }),
            contentType: "application/json"
          };

          await mockSubgraph({
            page,
            options: { mockGetOffers: { response } }
          });

          await page.goto("/");
          const errorOffersSelector = `[data-testid=${offersType}] [data-testid=errorOffers]`;
          await page.waitForSelector(errorOffersSelector);
          const noOffers = await page.locator(errorOffersSelector);
          await expect(noOffers).toHaveText(
            "There has been an error, please try again later..."
          );
        });
      });
    });
  });
});
