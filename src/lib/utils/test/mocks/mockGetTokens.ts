import { Page, Route } from "@playwright/test";

import { graphqlEndpoint } from "../environment";

export async function mockGetTokens(page: Page) {
  await page.route(graphqlEndpoint, async (route: Route) => {
    const postData = route.request().postData();
    const isExchangeTokensRequest = postData?.includes("exchangeTokens");
    if (!isExchangeTokensRequest) return;

    const exchangeTokens = {
      data: {
        exchangeTokens: [
          {
            symbol: "BOSON"
          }
        ]
      }
    };

    const options = {
      status: 200,
      body: JSON.stringify(exchangeTokens),
      contentType: "application/json"
    };

    await route.fulfill(options);
  });
}
