import { Offer } from "../../src/lib/types/offer";
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
    offersPerPage?: {
      offersList: Offer[][];
      countOffersPerPage: number;
    };
  };
}
export async function mockGetOffers({
  postData,
  options: { offers = defaultMockOffers, response, offersPerPage } = {}
}: MockProps) {
  let baseMetadataEntities = null;
  if (!response && postData) {
    let idx = 0;
    const { variables } = JSON.parse(postData);

    if (variables.skip !== undefined && offersPerPage) {
      const skip = variables.skip || 0;
      idx = Math.ceil(skip / offersPerPage.countOffersPerPage);
      offers = offersPerPage.offersList[idx] || [];
    }

    if (variables.first !== undefined) {
      offers = offers.slice(0, variables.first);
    }

    baseMetadataEntities = offers.map((offer) => ({
      offer
    }));

    if (
      variables.orderBy !== undefined &&
      variables.orderDirection !== undefined
    ) {
      const { orderBy, orderDirection } = variables;
      if (!["asc", "desc"].includes(orderDirection)) {
        throw new Error(
          `unsupported order direction=${orderDirection}. It should be either 'asc' or 'desc'`
        );
      }
      baseMetadataEntities = baseMetadataEntities.sort(
        sortOffersBy({ property: orderBy, asc: orderDirection === "asc" })
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
