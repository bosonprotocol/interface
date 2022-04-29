import { expect } from "@playwright/test";

import { MockProps } from "../../../../pages/explore/Explore.spec";
import { graphqlEndpoint } from "../environment";
import { defaultMockOffers } from "./defaultMockOffers";

export async function mockGetOffers({
  page,
  options: { offers = defaultMockOffers, response, filterBy } = {}
}: MockProps) {
  await page.route(graphqlEndpoint, async (route) => {
    const postData = route.request().postData();
    const isBaseEntitiesRequest = postData?.includes("baseMetadataEntities(");
    if (!isBaseEntitiesRequest) return;

    if (filterBy) {
      await expect(
        postData?.includes(`${filterBy.property}:${filterBy.value}`)
      ).toBeTruthy();
    }

    const formattedOffers = offers.map((offer) => ({
      offer
    }));

    const options = {
      status: 200,
      body: JSON.stringify({
        data: { baseMetadataEntities: formattedOffers }
      }),
      contentType: "application/json",
      ...response
    };

    await route.fulfill(options);
  });
}
