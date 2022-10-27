import { offers as offersSdk, subgraph } from "@bosonprotocol/react-kit";
import groupBy from "lodash/groupBy";
import { useContext, useMemo } from "react";
import { useQuery } from "react-query";

import ConvertionRateContext from "../../../../components/convertion-rate/ConvertionRateContext";
import { CONFIG } from "../../../config";
import { calcPrice } from "../../calcPrice";
import { convertPrice } from "../../convertPrice";
import { useCoreSDK } from "../../useCoreSdk";

const sortByFn = (arr: any, key: string, reverse: boolean) => {
  const newArr = arr.sort((a: any, b: any) => a[key] - b[key]);

  if (reverse) {
    return newArr.reverse().find((a: any) => a[key] !== null)?.[key] || null;
  }
  return newArr.find((a: any) => a[key] !== null)?.[key] || null;
};
const sortByFnReturn = (arr: any, key: string, reverse: boolean) => {
  const newArr = arr.sort((a: any, b: any) => a[key] - b[key]);

  if (reverse) {
    return newArr.reverse().find((a: any) => a[key] !== null);
  }
  return newArr.find((a: any) => a[key] !== null);
};

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
      enabled: !!coreSDK,
      refetchOnMount: true
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
      enabled: !!coreSDK && productsIds?.length > 0,
      refetchOnMount: true
    }
  );

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
                ...offer,
                status,
                convertedPrice: offerPrice?.converted || null,
                committedDate: sortByFn(offer.exchanges, "committedDate", true),
                redeemedDate: sortByFn(offer.exchanges, "redeemedDate", true)
              };
            })
            .filter(
              (n: any) =>
                n &&
                n?.voided === false &&
                n?.status !== offersSdk.OfferState.EXPIRED
            );

          if (offers.length > 0) {
            return {
              uuid: product?.uuid,
              title: product?.title,
              ...(offers?.[0] || []),
              brandName: product?.brand?.name,
              lowPrice: sortByFn(offers, "convertedPrice", false),
              highPrice: sortByFn(offers, "convertedPrice", true),
              priceDetails: {
                low: {
                  value: sortByFnReturn(offers, "price", false)?.price || null,
                  exchangeToken:
                    sortByFnReturn(offers, "price", false)?.exchangeToken ||
                    null
                },
                high: {
                  value: sortByFnReturn(offers, "price", true)?.price || null,
                  exchangeToken:
                    sortByFnReturn(offers, "price", true)?.exchangeToken || null
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
        .filter((n) => n) || []
    );
  }, [productsWithVariants?.data, store?.rates]);

  console.log("allProducts", allProducts);

  const allSellers = useMemo(() => {
    const grouped = groupBy(allProducts, "seller.id") || {};
    return (
      Object.keys(grouped)?.map((brandName) => {
        const offers = grouped[brandName as keyof typeof grouped];
        const seller = offers?.[0]?.seller || {};
        return {
          ...seller,
          brandName,
          createdAt: sortByFn(offers, "createdAt", true),
          validFromDate: sortByFn(offers, "validFromDate", true),
          committedDate: sortByFn(offers, "committedDate", true),
          redeemedDate: sortByFn(offers, "redeemedDate", true),
          lowPrice: sortByFn(offers, "convertedPrice", false),
          highPrice: sortByFn(offers, "convertedPrice", true),
          additional: {
            images: offers?.map((offer: any) => offer?.metadata?.image)
          },
          offers
        };
      }) || []
    );
  }, [allProducts]);

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
