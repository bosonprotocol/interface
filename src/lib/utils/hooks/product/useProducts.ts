import { offers as offersSdk, subgraph } from "@bosonprotocol/react-kit";
import { gql } from "graphql-request";
import groupBy from "lodash/groupBy";
import omit from "lodash/omit";
import orderBy from "lodash/orderBy";
import sortBy from "lodash/sortBy";
import { useContext, useMemo } from "react";
import { useQuery } from "react-query";

import ConvertionRateContext from "../../../../components/convertion-rate/ConvertionRateContext";
import type {
  ExtendedOffer,
  ExtendedSeller
} from "../../../../pages/explore/WithAllOffers";
import { CONFIG } from "../../../config";
import { isTruthy } from "../../../types/helpers";
import { calcPrice } from "../../calcPrice";
import { convertPrice } from "../../convertPrice";
import { fetchSubgraph } from "../../core-components/subgraph";
import { useCoreSDK } from "../../useCoreSdk";
import { useCurationLists } from "../useCurationLists";
import { Exchange } from "../useExchanges";

const OFFERS_PER_PAGE = 1000;

interface AdditionalFiltering {
  quantityAvailable_gte?: number;
  productsIds?: string[];
  onlyNotVoided?: boolean;
  onlyValid?: boolean;
}

export default function useProducts(
  props: subgraph.GetProductV1ProductsQueryQueryVariables &
    AdditionalFiltering = {},
  options: {
    enabled?: boolean;
    keepPreviousData?: boolean;
    refetchOnMount?: boolean;
    enableCurationList: boolean;
    withNumExchanges?: boolean;
  }
) {
  const curationLists = useCurationLists();
  const now = Math.floor(Date.now() / 1000);
  const validityFilter = props.onlyValid
    ? {
        minValidFromDate_lte: now + "",
        maxValidUntilDate_gte: now + ""
      }
    : {};
  const baseProps = useMemo(
    () => ({
      ...omit(props, ["productsIds", "quantityAvailable_gte"]),
      productsFirst: OFFERS_PER_PAGE,
      productsFilter: {
        uuid_in: props?.productsIds || undefined,
        disputeResolverId: CONFIG.defaultDisputeResolverId,
        sellerId_in: options.enableCurationList
          ? curationLists.sellerCurationList
          : undefined,
        ...props.productsFilter
      }
    }),
    [props, options, curationLists]
  );

  const coreSDK = useCoreSDK();
  const { store } = useContext(ConvertionRateContext);

  const productsVariants = useQuery(
    ["get-all-products-variants", baseProps],
    async () => {
      const newProps = {
        ...baseProps,
        productsFilter: {
          ...validityFilter,
          ...baseProps.productsFilter
        }
      };
      const data = props.onlyNotVoided
        ? await coreSDK.getAllProductsWithNotVoidedVariants({ ...newProps })
        : await coreSDK.getAllProductsWithVariants({ ...newProps });
      let loop = data.length === OFFERS_PER_PAGE;
      let productsSkip = OFFERS_PER_PAGE;
      while (loop) {
        const data_to_add = props.onlyNotVoided
          ? await coreSDK.getAllProductsWithNotVoidedVariants({
              ...newProps,
              productsSkip
            })
          : await coreSDK.getAllProductsWithVariants({
              ...newProps,
              productsSkip
            });
        data.push(...data_to_add);
        loop = data_to_add.length === OFFERS_PER_PAGE;
        productsSkip += OFFERS_PER_PAGE;
      }
      return data;
    },
    {
      ...options,
      enabled: options.enabled && !!coreSDK,
      refetchOnWindowFocus: false,
      refetchOnMount: options.refetchOnMount || false
    }
  );

  const allProducts = useMemo(() => {
    return (
      (productsVariants?.data || [])
        ?.map((product) => {
          const allVariantsOrOnlyNotVoided:
            | subgraph.ProductV1Variant[]
            | undefined
            | null = props.onlyNotVoided
            ? (product as subgraph.ProductV1Product).notVoidedVariants
            : (product as subgraph.ProductV1Product).variants;
          const offers = (allVariantsOrOnlyNotVoided || [])?.map(
            ({ offer }) => {
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
                  ((offer?.exchanges || []) as unknown as Exchange[])
                    .sort(
                      (a: Exchange, b: Exchange) =>
                        Number(a?.committedDate || "0") -
                        Number(b?.committedDate || "0")
                    )
                    .reverse()
                    .find((n: Exchange) => n.committedDate !== null)
                    ?.committedDate || null,
                redeemedDate:
                  ((offer?.exchanges || []) as unknown as Exchange[])
                    .sort(
                      (a: Exchange, b: Exchange) =>
                        Number(a?.redeemedDate) - Number(b?.redeemedDate)
                    )
                    .reverse()
                    .find((n: Exchange) => n.redeemedDate !== null)
                    ?.redeemedDate || null
              };
            }
          );

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
    props?.quantityAvailable_gte,
    props?.onlyNotVoided,
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
      enabled: options.withNumExchanges && !!coreSDK && sellerIds?.length > 0,
      refetchOnMount: true
    }
  );

  const allSellers = useMemo(() => {
    return (
      sellerIds?.map((brandName) => {
        const sellerId = brandName;
        const products =
          groupedSellers[brandName as keyof typeof groupedSellers];
        const seller = products?.[0]?.seller || {};
        const title = products?.[0]?.title || {};
        return {
          ...seller,
          title,
          brandName,
          createdAt:
            orderBy(products, "createdAt", "desc").find(
              (n) => n?.createdAt !== null
            )?.createdAt || null,
          validFromDate:
            orderBy(products, "validFromDate", "desc").find(
              (n) => n?.validFromDate !== null
            )?.validFromDate || null,
          committedDate:
            orderBy(products, "committedDate", "desc").find(
              (n) => n?.committedDate !== null
            )?.committedDate || null,
          redeemedDate:
            orderBy(products, "redeemedDate", "desc").find(
              (n) => n?.redeemedDate !== null
            )?.redeemedDate || null,
          lowPrice:
            orderBy(products, "lowPrice", "asc").find(
              (n) => n?.lowPrice !== null && Number(n?.lowPrice || 0) !== 0
            )?.lowPrice || null,
          highPrice:
            orderBy(products, "highPrice", "desc").find(
              (n) => n?.highPrice !== null && Number(n?.highPrice || 0) !== 0
            )?.highPrice || null,
          additional: {
            images: products?.map((offer) => offer?.metadata?.image) || []
          },
          offers: products, // REASSIGN OFFERS for compatibility with previous code
          products,
          numExchanges: exchangesBySellers.data?.[sellerId]?.length
        };
      }) || []
    );
  }, [sellerIds, groupedSellers, exchangesBySellers.data]);

  return {
    isLoading: productsVariants.isLoading || exchangesBySellers.isLoading,
    isError: productsVariants.isError || exchangesBySellers.isError,
    products: allProducts as unknown as ExtendedOffer[],
    sellers: allSellers as unknown as ExtendedSeller[],
    refetch: () => {
      productsVariants.refetch();
      if (options.withNumExchanges) {
        exchangesBySellers.refetch();
      }
    }
  };
}
