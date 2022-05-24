import { Offer } from "@lib/types/offer";
import { expect } from "playwright-test-coverage";

import { sortOffersBy } from "../utils/sort";
import { defaultMockOffers } from "./defaultMockOffers";
import { CustomResponse } from "./mockGetBase";

export interface MockProps {
  postData: string | null;
  options?: {
    offers?: Offer[];
    response?: Partial<CustomResponse>;
    orderBy?: {
      value: string;
      property: string;
    };
    offersPerPage?: Offer[][];
    countOffersPerPage?: number;
  };
}
export async function mockGetOffers({
  postData,
  options: {
    offers = defaultMockOffers,
    response,
    offersPerPage,
    countOffersPerPage
  } = {}
}: MockProps) {
  let baseMetadataEntities = null;

  if (!response && postData) {
    let idx = 0;
    const { variables } = JSON.parse(postData);
    if (variables.skip !== undefined && countOffersPerPage && offersPerPage) {
      const skip = variables.skip || 0;
      idx = skip / countOffersPerPage;
      offers = offersPerPage[idx];
      await expect(offers).toBeDefined();
    }
    baseMetadataEntities = offers.map((offer) => ({
      offer
    }));

    const orderByName = !!postData.includes(`orderBy: name`);
    const orderDirectionAsc = !!postData.includes(`orderDirection: asc`);

    if (orderByName) {
      baseMetadataEntities = baseMetadataEntities.sort(
        sortOffersBy({ property: "name", asc: orderDirectionAsc })
      );
    }
  }

  const options = {
    status: 200,
    body: JSON.stringify({
      data: { baseMetadataEntities: baseMetadataEntities }
    }),
    contentType: "application/json",
    ...response
  };

  return options;
}
