import { offers as offersSdk, subgraph } from "@bosonprotocol/react-kit";
import dayjs from "dayjs";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import sortBy from "lodash/sortBy";
import { useContext, useMemo } from "react";
import { useQuery } from "react-query";

import ConvertionRateContext from "../../../../components/convertion-rate/ConvertionRateContext";
import { CONFIG } from "../../../config";
import { calcPrice } from "../../calcPrice";
import { convertPrice } from "../../convertPrice";
import { getDateTimestamp } from "../../getDateTimestamp";
import { useCoreSDK } from "../../useCoreSdk";

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
export default function useProducts(
  props: subgraph.GetProductV1ProductsQueryQueryVariables = {}
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
      enabled: !!coreSDK
    }
  );
  const productsIds =
    products?.data?.map((p) => p?.uuid || "")?.filter((n) => n !== "") || [];

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
      );
    },
    {
      enabled: !!coreSDK && productsIds?.length > 0
    }
  );
  console.log("productsWithVariants", productsWithVariants);

  const allProducts = useMemo(() => {
    return (
      productsWithVariants?.data
        ?.map(({ product, variants }: any) => {
          const offers = variants
            ?.map(({ offer }: any) => {
              const status = offersSdk.getOfferStatus(offer);
              const offerPrice = convertPrice({
                price: calcPrice(
                  offer?.price || 0,
                  offer?.exchangeToken.decimals || 0
                ),
                symbol: offer?.exchangeToken.symbol.toUpperCase(),
                currency: CONFIG.defaultCurrency,
                rates: store.rates,
                fixed: 8
              });
              return {
                date: {
                  createdAt: dayjs(getDateTimestamp(offer?.createdAt)).format(),
                  validFromDate: dayjs(
                    getDateTimestamp(offer?.validFromDate)
                  ).format()
                },
                ...offer,
                status,
                convertedPrice: offerPrice.converted,
                committedDate:
                  sortBy(offer.exchanges, "committedDate")[0]?.committedDate ||
                  null,
                redeemedDate:
                  sortBy(offer.exchanges, "redeemedDate")[0]?.redeemedDate ||
                  null
              };
            })
            .filter(
              (n: any) =>
                n?.voided === false &&
                n?.status !== offersSdk.OfferState.EXPIRED
            );
          const lowerPriceOffer = sortBy(offers, "convertedPrice");

          if (offers.length > 0) {
            return {
              uuid: product?.uuid,
              title: product?.title,
              ...(lowerPriceOffer?.[0] || offers?.[0] || []),
              brandName: product?.brand?.name,
              additional: {
                sortBy: {
                  createdAt:
                    orderBy(offers, ["createdAt"], ["desc"])?.[0]?.createdAt ||
                    null,
                  committedDate:
                    orderBy(offers, ["committedDate"], ["desc"])?.[0]
                      ?.committedDate || null,
                  redeemedDate:
                    orderBy(offers, ["redeemedDate"], ["desc"])?.[0]
                      ?.redeemedDate || null,
                  validFromDate:
                    orderBy(offers, ["validFromDate"], ["desc"])?.[0]
                      ?.validFromDate || null,
                  lowPrice:
                    orderBy(offers, ["convertedPrice"], ["asc"])?.[0]
                      ?.convertedPrice || null,
                  highPrice:
                    orderBy(offers, ["convertedPrice"], ["desc"])?.[0]
                      ?.convertedPrice || null
                },
                variants: offers,
                product
              }
            };
          }

          return null;
        })
        .filter((n) => n) || []
    );
  }, [productsWithVariants?.data, store?.rates]);

  const allSellers = useMemo(() => {
    const grouped = groupBy(allProducts, "seller.id") || {};
    console.log("allProducts", allProducts, grouped);
    return (
      Object.keys(grouped)?.map((brandName) => {
        const offers = grouped[brandName as keyof typeof grouped];
        const seller = offers?.[0]?.seller || {};
        const sortBy = offers?.map((offer: any) => offer?.additional?.sortBy);
        return {
          ...seller,
          brandName,
          additional: {
            images: offers?.map((offer: any) => offer?.metadata?.image),
            sortBy: {
              createdAt:
                orderBy(sortBy, ["createdAt"], ["desc"])?.[0]?.createdAt ||
                null,
              committedDate:
                orderBy(sortBy, ["committedDate"], ["desc"])?.[0]
                  ?.committedDate || null,
              redeemedDate:
                orderBy(sortBy, ["redeemedDate"], ["desc"])?.[0]
                  ?.redeemedDate || null,
              validFromDate:
                orderBy(sortBy, ["validFromDate"], ["desc"])?.[0]
                  ?.validFromDate || null,
              lowPrice:
                orderBy(sortBy, ["lowPrice"], ["asc"])?.[0]?.lowPrice || null,
              highPrice:
                orderBy(sortBy, ["highPrice"], ["desc"])?.[0]?.highPrice || null
            }
          },
          offers
        };
      }) || []
    );
  }, [allProducts]);
  console.log("allSellers", allSellers);

  const values = {
    isLoading: products.isLoading || productsWithVariants.isLoading,
    isError: products.isError || productsWithVariants.isError,
    products: allProducts,
    sellers: allSellers,
    data: {
      products,
      productsWithVariants
    }
  };

  return values;
}
