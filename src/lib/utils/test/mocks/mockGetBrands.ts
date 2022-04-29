import { Page, Route } from "@playwright/test";

import { graphqlEndpoint } from "../environment";

export async function mockGetBrands(page: Page) {
  await page.route(graphqlEndpoint, async (route: Route) => {
    const postData = route.request().postData();
    const isBrandsRequest = postData?.includes("productV1MetadataEntities");
    if (!isBrandsRequest) return;

    const brands = {
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

    const options = {
      status: 200,
      body: JSON.stringify(brands),
      contentType: "application/json"
    };

    await route.fulfill(options);
  });
}
