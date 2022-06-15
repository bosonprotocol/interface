import { defaultMockOffers } from "./defaultMockOffers";
import { CustomResponse } from "./mockGetBase";

export interface MockProps {
  postData: string | null;
  options: {
    response?: Partial<CustomResponse>;
  };
}
export async function mockGetExchanges({ postData, options }: MockProps) {
  const { response } = options;
  if (response) {
    return {
      contentType: "application/json",
      status: 200,
      body: JSON.stringify({
        data: { exchanges: [] }
      }),
      ...response
    };
  }
  const exchanges = {
    data: {
      exchanges: [
        {
          id: "1",
          committedDate: "",
          disputed: false,
          expired: false,
          finalizedDate: "",
          redeemedDate: "",
          state: "",
          validUntilDate: "",
          seller: {
            id: defaultMockOffers[0].seller.id
          },
          buyer: {
            id: "3"
          },
          offer: defaultMockOffers[0]
        }
      ]
    }
  };

  return {
    status: 200,
    body: JSON.stringify(exchanges),
    contentType: "application/json"
  };
}
