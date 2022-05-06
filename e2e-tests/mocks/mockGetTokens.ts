import { CustomResponse } from "./mockGetBase";

export interface MockProps {
  postData: string | null;
  options?: {
    response?: CustomResponse;
    filterBy?: {
      value: string;
      property: string;
    };
  };
}
export async function mockGetTokens({ postData }: MockProps) {
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
  return options;
}
