import { Page } from "@playwright/test";

import { graphqlEndpoint } from "../environment";
import {
  mockGetBrands,
  MockProps as mockGetBrandsProps
} from "./mockGetBrands";
import {
  mockGetExchanges,
  MockProps as mockGetExchangesProps
} from "./mockGetExchanges";
import {
  mockGetOffers,
  MockProps as mockGetOffersProps
} from "./mockGetOffers";
import {
  mockGetSellers,
  MockProps as mockGetSellersProps
} from "./mockGetSellers";
import {
  mockGetTokens,
  MockProps as mockGetTokensProps
} from "./mockGetTokens";

interface MockSubgraphProps {
  page: Page;
  options?: Partial<{
    mockGetOffers?: mockGetOffersProps["options"];
    mockGetBrands?: mockGetBrandsProps["options"];
    mockGetTokens?: mockGetTokensProps["options"];
    mockGetSellers?: mockGetSellersProps["options"];
    mockGetExchanges?: mockGetExchangesProps["options"];
  }>;
}

export interface CustomResponse {
  status: number;
  body: string;
  contentType: string;
}

export async function mockSubgraph({ page, options }: MockSubgraphProps) {
  await page.route(graphqlEndpoint, async (route) => {
    const postData = route.request().postData();

    const isBaseEntitiesRequest = postData?.includes("baseMetadataEntities(");
    const isBrandsRequest = postData?.includes("productV1MetadataEntities");
    const isExchangeTokensRequest = postData?.includes("exchangeTokens");
    const isGetSingleBaseEntity = postData?.includes("GetOfferById("); // iframe widget makes this request
    const isGetSellersReq = postData?.includes("GetSellers");
    const isGetExchangesReq = postData?.includes("GetExchanges");

    let mockResponse;
    if (isBaseEntitiesRequest || isGetSingleBaseEntity) {
      mockResponse = await mockGetOffers({
        postData,
        options: options?.mockGetOffers || {}
      });
    } else if (isBrandsRequest) {
      mockResponse = await mockGetBrands({
        postData,
        options: options?.mockGetBrands || {}
      });
    } else if (isExchangeTokensRequest) {
      mockResponse = await mockGetTokens({
        postData,
        options: options?.mockGetTokens || {}
      });
    } else if (isGetSellersReq) {
      mockResponse = await mockGetSellers({
        postData,
        options: options?.mockGetSellers || {}
      });
    } else if (isGetExchangesReq) {
      mockResponse = await mockGetExchanges({
        postData,
        options: options?.mockGetExchanges || {}
      });
    } else {
      throw new Error(
        `This request has not been mocked, check your e2e test: ${postData}`
      );
    }

    await route.fulfill(mockResponse);
  });
}
