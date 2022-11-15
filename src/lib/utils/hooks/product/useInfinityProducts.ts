import { offers as offersSdk, subgraph } from "@bosonprotocol/react-kit";
import { gql } from "graphql-request";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import sortBy from "lodash/sortBy";
import { useContext, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "react-query";

import ConvertionRateContext from "../../../../components/convertion-rate/ConvertionRateContext";
import type {
  ExtendedOffer,
  ExtendedSeller
} from "../../../../pages/explore/WithAllOffers";
import { CONFIG } from "../../../config";
import { isTruthy } from "../../../types/helpers";
import { Offer } from "../../../types/offer";
import { calcPrice } from "../../calcPrice";
import { convertPrice } from "../../convertPrice";
import { fetchSubgraph } from "../../core-components/subgraph";
import { useCoreSDK } from "../../useCoreSdk";
import { offerGraphQl } from "../offer/graphql";
import { Exchange } from "../useExchanges";

const OFFERS_PER_PAGE = 1000;

const chunk = <T>(arr: T[], size: number): T[][] =>
  [...Array(Math.ceil(arr.length / size))].map((_, i) =>
    arr.slice(size * i, size + size * i)
  );

interface PromiseProps {
  status: string;
  value: null | {
    product: subgraph.BaseProductV1ProductFieldsFragment;
    variants: {
      offer: subgraph.OfferFieldsFragment;
      variations: subgraph.ProductV1Variation[];
    }[];
  };
}
interface Variant {
  offer: Offer;
  variations: subgraph.ProductV1Variation[];
}
type Product = subgraph.BaseProductV1ProductFieldsFragment;
interface ProductWithVariants extends Product {
  variants: Variant[];
}

interface AdditionalFiltering {
  quantityAvailable_gte?: number;
  productsIds?: string[];
  withNumExchanges?: boolean;
  showVoided?: boolean;
  showExpired?: boolean;
}

export default function useInfinityProducts(
  props: subgraph.GetProductV1ProductsQueryQueryVariables &
    AdditionalFiltering = {},
  options: {
    enabled?: boolean;
    keepPreviousData?: boolean;
    refetchOnMount?: boolean;
  } = {}
) {
  const [pageIndex, setPageIndex] = useState(0);
  const coreSDK = useCoreSDK();
  const { store } = useContext(ConvertionRateContext);

  const {
    data,
    isError,
    isSuccess,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch: refetchProductIds
  } = useInfiniteQuery(
    ["get-all-product-ids", "infinite", props],
    async (context) => {
      const skip = context.pageParam || 0;
      const page = await coreSDK.getProductV1Products({
        ...props,
        productsSkip: skip,
        productsFirst: OFFERS_PER_PAGE
      });
      return page;
    },
    {
      ...options,
      enabled: !!coreSDK,
      getNextPageParam: (lastPage) => lastPage.length === OFFERS_PER_PAGE,
      refetchOnWindowFocus: false,
      refetchOnMount: options.refetchOnMount || false
    }
  );

  useEffect(() => {
    if (!isSuccess || isLoading || isFetchingNextPage) {
      return;
    } else if (hasNextPage === true) {
      const nextPageIndex = pageIndex + 1;
      setPageIndex(nextPageIndex);
      fetchNextPage({ pageParam: nextPageIndex * OFFERS_PER_PAGE });
    }
  }, [
    isSuccess,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    pageIndex
  ]);

  const productsIds = useMemo(
    () =>
      isSuccess && !isLoading && !isFetchingNextPage
        ? (data?.pages || [])
            .flatMap((p) => p || null)
            .map((p) => p?.uuid || null)
            .filter(isTruthy)
        : [],
    [isSuccess, isLoading, isFetchingNextPage, data]
  );

  const productsVariants = useQuery(
    ["get-all-products-by-uuid-v2"],
    async () => {
      const productIdsSplitToChunks = chunk(productsIds, OFFERS_PER_PAGE);
      const allProductPromises = productIdsSplitToChunks.map(
        async (ids: string[]) => {
          const result = await fetchSubgraph<{
            productV1Products: ProductWithVariants[];
          }>(
            gql`
            query GetAllProductsByUUID($productsIds: [String], $first: Int) {
              productV1Products(where: { uuid_in: $productsIds }, first: $first) {
                variants {
                  offer ${offerGraphQl}
                  variations {
                    id
                    option
                    type
                  }
                }
                id
                uuid
                version
                title
                description
                identification_sKU
                identification_productId
                identification_productIdType
                productionInformation_brandName
                productionInformation_manufacturer
                productionInformation_manufacturerPartNumber
                productionInformation_modelNumber
                productionInformation_materials
                details_category
                details_subCategory
                details_subCategory2
                details_offerCategory
                offerCategory
                details_tags
                details_sections
                details_personalisation
                packaging_packageQuantity
                packaging_dimensions_length
                packaging_dimensions_width
                packaging_dimensions_height
                packaging_dimensions_unit
                packaging_weight_value
                packaging_weight_unit
                brand {
                  id
                  name
                }
                category {
                  id
                  name
                }
                subCategory {
                  id
                  name
                }
                subCategory2 {
                  id
                  name
                }
                tags {
                  id
                  name
                }
                sections {
                  id
                  name
                }
                personalisation {
                  id
                  name
                }
                visuals_images {
                  id
                  url
                  tag
                  type
                }
                visuals_videos {
                  id
                  url
                  tag
                  type
                }
                productV1Seller {
                  id
                  defaultVersion
                  name
                  description
                  externalUrl
                  tokenId
                  sellerId
                  images {
                    id
                    url
                    tag
                    type
                  }
                  contactLinks {
                    id
                    url
                    tag
                  }
                  seller {
                    id
                    operator
                    admin
                    clerk
                    treasury
                    authTokenId
                    authTokenType
                    voucherCloneAddress
                    active
                    contractURI
                    royaltyPercentage
                  }
                }
              }
            }
          `,
            {
              productsIds: ids,
              first: OFFERS_PER_PAGE
            }
          );
          return result?.productV1Products;
        }
      );
      const allProducts = await Promise.allSettled(allProductPromises);
      const response = allProducts.filter(
        (res) => res.status === "fulfilled"
      ) as unknown as PromiseProps[];
      return (response?.flatMap((p) => p?.value || null) || []).filter(
        isTruthy
      ) as unknown as ProductWithVariants[];
    },
    {
      enabled: !!coreSDK && productsIds?.length > 0,
      refetchOnMount: true
    }
  );

  const allProducts = useMemo(() => {
    return (
      (productsVariants?.data || [])
        ?.map(({ variants, ...product }: ProductWithVariants) => {
          let offers = (variants || [])?.map(({ offer }: Variant) => {
            const status = offersSdk.getOfferStatus(offer);
            const offerPrice = convertPrice({
              price: calcPrice(
                offer?.price || "0",
                offer?.exchangeToken.decimals || "0"
              ),
              symbol: offer?.exchangeToken.symbol.toUpperCase(),
              currency: CONFIG.defaultCurrency,
              rates: store.rates,
              fixed: store.fixed
            });
            return {
              ...offer,
              isValid: true,
              status,
              convertedPrice: offerPrice?.converted || null,
              committedDate:
                ((offer?.exchanges || []) as Exchange[])
                  .sort(
                    (a: Exchange, b: Exchange) =>
                      Number(a?.committedDate || "0") -
                      Number(b?.committedDate || "0")
                  )
                  .reverse()
                  .find((n: Exchange) => n.committedDate !== null)
                  ?.committedDate || null,
              redeemedDate:
                ((offer?.exchanges || []) as Exchange[])
                  .sort(
                    (a: Exchange, b: Exchange) =>
                      Number(a?.redeemedDate) - Number(b?.redeemedDate)
                  )
                  .reverse()
                  .find((n: Exchange) => n.redeemedDate !== null)
                  ?.redeemedDate || null
            };
          });

          if (!props?.showVoided) {
            offers = offers.filter(
              (n: { voided: boolean; status: string }) => n && !n?.voided
            );
          }

          if (!props?.showExpired) {
            offers = offers.filter(
              (n: { voided: boolean; status: string }) =>
                n && n?.status !== offersSdk.OfferState.EXPIRED
            );
          }

          if (offers.length > 0) {
            const lowerPriceOffer = sortBy(offers, "convertedPrice");
            const itemsAvailable = offers.reduce(
              (acc: number, e) =>
                e && e.quantityAvailable
                  ? (acc += Number(e.quantityAvailable))
                  : acc,
              0
            );

            if (props?.quantityAvailable_gte) {
              if (itemsAvailable < props?.quantityAvailable_gte) {
                return null;
              }
            }
            return {
              uuid: product?.uuid,
              title: product?.title,
              ...(lowerPriceOffer?.[0] || offers?.[0] || []),
              brandName: product?.brand?.name,
              lowPrice:
                orderBy(offers, "convertedPrice", "asc").find(
                  (n) =>
                    n?.convertedPrice !== null &&
                    Number(n?.convertedPrice || 0) !== 0
                )?.convertedPrice || null,
              highPrice:
                orderBy(offers, "convertedPrice", "desc").find(
                  (n) =>
                    n?.convertedPrice !== null &&
                    Number(n?.convertedPrice || 0) !== 0
                )?.convertedPrice || null,
              priceDetails: {
                low: {
                  value:
                    orderBy(offers, "price", "asc").find(
                      (n) => n?.price !== null && Number(n?.price || 0) !== 0
                    )?.price || null,
                  exchangeToken:
                    orderBy(offers, "price", "asc").find(
                      (n) => n?.price !== null && Number(n?.price || 0) !== 0
                    )?.exchangeToken || null
                },
                high: {
                  value:
                    orderBy(offers, "price", "desc").find(
                      (n) => n?.price !== null && Number(n?.price || 0) !== 0
                    )?.price || null,
                  exchangeToken:
                    orderBy(offers, "price", "desc").find(
                      (n) => n?.price !== null && Number(n?.price || 0) !== 0
                    )?.exchangeToken || null
                }
              },
              additional: {
                variants: offers,
                product
              }
            };
          }

          return null;
        })
        .filter(isTruthy) || []
    );
  }, [
    productsVariants?.data,
    props?.showVoided,
    props?.showExpired,
    props?.quantityAvailable_gte,
    store.fixed,
    store.rates
  ]);

  const groupedSellers = useMemo(
    () => groupBy(allProducts, "seller.id") || {},
    [allProducts]
  );

  const sellerIds = useMemo(
    () => Object.keys(groupedSellers),
    [groupedSellers]
  );

  const exchangesBySellers = useQuery(
    ["get-all-exchanges-from-sellers", props],
    async () => {
      const numItemsPerRequest = 1000;
      let skip = 0;
      let result;
      const allExchanges: {
        seller: {
          id: string;
        };
      }[] = [];
      while (!result || result.exchanges.length === numItemsPerRequest) {
        result = await fetchSubgraph<{
          exchanges: {
            seller: {
              id: string;
            };
          }[];
        }>(
          gql`
            query GetSellersExchanges(
              $sellerIds: [String]
              $first: Int
              $skip: Int
            ) {
              exchanges(
                where: { seller_in: $sellerIds }
                first: $first
                skip: $skip
              ) {
                seller {
                  id
                }
              }
            }
          `,
          {
            sellerIds,
            first: numItemsPerRequest,
            skip: skip
          }
        );
        skip += numItemsPerRequest;
        allExchanges.push(...result.exchanges);
      }

      return groupBy(allExchanges, "seller.id") || {};
    },
    {
      enabled: props.withNumExchanges && !!coreSDK && sellerIds?.length > 0,
      refetchOnMount: true
    }
  );

  const allSellers = useMemo(() => {
    return (
      sellerIds?.map((brandName) => {
        const sellerId = brandName;
        const offers = groupedSellers[brandName as keyof typeof groupedSellers];
        const seller = offers?.[0]?.seller || {};
        const title = offers?.[0]?.title || {};
        return {
          ...seller,
          title,
          brandName,
          createdAt:
            orderBy(offers, "createdAt", "desc").find(
              (n) => n?.createdAt !== null
            )?.createdAt || null,
          validFromDate:
            orderBy(offers, "validFromDate", "desc").find(
              (n) => n?.validFromDate !== null
            )?.validFromDate || null,
          committedDate:
            orderBy(offers, "committedDate", "desc").find(
              (n) => n?.committedDate !== null
            )?.committedDate || null,
          redeemedDate:
            orderBy(offers, "redeemedDate", "desc").find(
              (n) => n?.redeemedDate !== null
            )?.redeemedDate || null,
          lowPrice:
            orderBy(offers, "lowPrice", "asc").find(
              (n) => n?.lowPrice !== null && Number(n?.lowPrice || 0) !== 0
            )?.lowPrice || null,
          highPrice:
            orderBy(offers, "highPrice", "desc").find(
              (n) => n?.highPrice !== null && Number(n?.highPrice || 0) !== 0
            )?.highPrice || null,
          additional: {
            images: offers?.map((offer) => offer?.metadata?.image) || []
          },
          offers,
          numExchanges: exchangesBySellers.data?.[sellerId]?.length
        };
      }) || []
    );
  }, [sellerIds, groupedSellers, exchangesBySellers.data]);

  return {
    isLoading: !isSuccess || isLoading || productsVariants.isLoading,
    isError: isError || productsVariants.isError,
    products: allProducts as unknown as ExtendedOffer[],
    sellers: allSellers as unknown as ExtendedSeller[],
    refetch: () => {
      refetchProductIds();
      productsVariants.refetch();
    }
  };
}
