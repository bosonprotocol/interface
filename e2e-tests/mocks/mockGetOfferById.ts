import { Offer } from "../../src/lib/types/offer";
import { defaultMockOffers } from "./defaultMockOffers";
import { CustomResponse } from "./mockGetBase";

export interface MockProps {
  postData: string | null;
  options?: {
    offer?: Offer | null;
    response?: Partial<CustomResponse>;
  };
}
export async function mockGetOfferById({
  options: { offer = defaultMockOffers[0], response } = {}
}: MockProps) {
  const options = {
    status: 200,
    body: JSON.stringify({
      data: { offer }
    }),
    contentType: "application/json",
    ...response
  };

  return options;
}
