import { offers as offersSdk, subgraph } from "@bosonprotocol/react-kit";
import { gql } from "graphql-request";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import sortBy from "lodash/sortBy";
import { useContext, useMemo } from "react";
import { useQuery } from "react-query";

import ConvertionRateContext from "../../../../components/convertion-rate/ConvertionRateContext";
import type { ExtendedOffer } from "../../../../pages/explore/WithAllOffers";
import { ExtendedSeller } from "../../../../pages/explore/WithAllOffers";
import { CONFIG } from "../../../config";
import { isTruthy } from "../../../types/helpers";
import { calcPrice } from "../../calcPrice";
import { convertPrice } from "../../convertPrice";
import { fetchSubgraph } from "../../core-components/subgraph";
import { useCoreSDK } from "../../useCoreSdk";
import type { Exchange } from "../useExchanges";

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
  offer: ExtendedOffer;
  variations: subgraph.ProductV1Variation[];
}
interface ProductWithVariants {
  product: subgraph.BaseProductV1ProductFieldsFragment;
  variants: Variant[];
}
interface AdditionalFiltering {
  quantityAvailable_gte?: number;
  productsIds?: string[];
  withNumExchanges?: boolean;
}

export default function useProducts(
  props: subgraph.GetProductV1ProductsQueryQueryVariables &
    AdditionalFiltering = {}
) {
  const coreSDK = useCoreSDK();
  const { store } = useContext(ConvertionRateContext);

  const products = useQuery(
    ["get-all-products", props],
    async () => {
      const products = await coreSDK.getProductV1Products(props);
      return products;
    },
    {
      enabled: !!coreSDK && !(props?.productsIds || false),
      refetchOnMount: true
    }
  );

  const productsIds = useMemo(
    () =>
      props?.productsIds ||
      products?.data?.map((p) => p?.uuid || "")?.filter(isTruthy) ||
      [],
    [props?.productsIds, products?.data]
  );

  const productsWithVariants = useQuery(
    ["get-all-products-by-uuid", { productsIds }],
    async () => {
      const allPromises = productsIds?.map(async (id) => {
        const product = await coreSDK?.getProductWithVariants(id);
        return product;
      });

      const allProducts = await Promise.allSettled(allPromises);
      const response = allProducts.filter(
        (res) => res.status === "fulfilled"
      ) as PromiseProps[];
      return (response?.flatMap((p) => p?.value || null) || []).filter(
        (n) => n
      ) as ProductWithVariants[];
    },
    {
      enabled: !!coreSDK && productsIds?.length > 0,
      refetchOnMount: true
    }
  );

  const allProducts = useMemo(() => {
    return (
      (productsWithVariants?.data || [])
        ?.map(({ product, variants }: ProductWithVariants) => {
          const offers = variants
            ?.map(({ offer }: Variant) => {
              const status = offersSdk.getOfferStatus(offer);
              const offerPrice = convertPrice({
                price: calcPrice(
                  offer?.price || "0",
                  offer?.exchangeToken.decimals || "0"
                ),
                symbol: offer?.exchangeToken.symbol.toUpperCase(),
                currency: CONFIG.defaultCurrency,
                rates: store.rates,
                fixed: 8
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
            })
            .filter(
              (n: { voided: boolean; status: string }) =>
                n &&
                n?.voided === false &&
                n?.status !== offersSdk.OfferState.EXPIRED
            ) as ExtendedOffer[];

          if (offers.length > 0) {
            const lowerPriceOffer = sortBy(offers, "convertedPrice");
            const itemsAvailable = offers.reduce(
              (acc: number, e: ExtendedOffer) =>
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
  }, [productsWithVariants?.data, store?.rates, props?.quantityAvailable_gte]);

  const groupedSellers = useMemo(() => {
    return groupBy(allProducts, "seller.id") || {};
  }, [allProducts]);
  const sellerIds = Object.keys(groupedSellers);

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
    isLoading: products.isLoading || productsWithVariants.isLoading,
    isError: products.isError || productsWithVariants.isError,
    products: allProducts as unknown as ExtendedOffer[],
    sellers: allSellers as unknown as ExtendedSeller[]
  };
}
