import { Offer } from "@lib/types/offer";

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
  };
}
export async function mockGetOffers({
  postData,
  options: { offers = defaultMockOffers, response } = {}
}: MockProps) {
  let baseMetadataEntities = null;

  if (!response) {
    baseMetadataEntities = offers.map((offer) => ({
      offer
    }));
    const orderByName = !!postData?.includes(`orderBy: name`);
    const orderDirectionAsc = !!postData?.includes(`orderDirection: asc`);

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
