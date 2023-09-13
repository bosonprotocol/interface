import { Offer } from "../../src/lib/types/offer";
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
export async function mockGetSellers() {
  const exchangeSellers = {
    data: {
      sellers: [
        {
          id: "1",
          assistant: "0x1",
          admin: "0x1",
          clerk: "0x1",
          treasury: "0x1",
          active: true
        },
        {
          id: "2",
          assistant: "0x2",
          admin: "0x2",
          clerk: "0x2",
          treasury: "0x2",
          active: true
        }
      ] as Pick<
        Offer["seller"],
        "id" | "assistant" | "admin" | "clerk" | "treasury" | "active"
      >[]
    }
  };

  const options = {
    status: 200,
    body: JSON.stringify(exchangeSellers),
    contentType: "application/json"
  };
  return options;
}
