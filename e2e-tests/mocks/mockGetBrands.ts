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

export async function mockGetBrands() {
  const brands = {
    data: {
      productV1MetadataEntities: [
        {
          product: {
            productionInformation_brandName: "brand1"
          }
        },
        {
          product: {
            productionInformation_brandName: "brand2"
          }
        }
      ]
    }
  };

  const options = {
    status: 200,
    body: JSON.stringify(brands),
    contentType: "application/json"
  };
  return options;
}
