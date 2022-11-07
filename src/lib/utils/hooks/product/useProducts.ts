import { offers as offersSdk, subgraph } from "@bosonprotocol/react-kit";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import sortBy from "lodash/sortBy";
import { useContext, useMemo } from "react";
import { useQuery } from "react-query";

import ConvertionRateContext from "../../../../components/convertion-rate/ConvertionRateContext";
import type { ExtendedOffer } from "../../../../pages/explore/WithAllOffers";
import { ExtendedSeller } from "../../../../pages/explore/WithAllOffers";
import { CONFIG } from "../../../config";
import { calcPrice } from "../../calcPrice";
import { convertPrice } from "../../convertPrice";
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
      products?.data?.map((p) => p?.uuid || "")?.filter((n) => n !== "") ||
      [],
    [props?.productsIds, products?.data]
  );

  const productsWithVariants = useQuery(
    ["get-all-products-by-uuid", { productsIds }],
    async () => {
      // const productsIdsSample = ["1666192974313"];
      // const allPromises = productsIds?.map(async (id) => {
      //   const product = await coreSDK?.getProductWithVariants(id);
      //   return product;
      // });

      // const allProducts = await Promise.allSettled(allPromises);
      console.log(
        "🚀  roberto --  ~ file: useProducts.ts ~ line 77 ~ productsIds",
        productsIds
      );
      const productsToFilter = [
        "1665660800327",
        "1665578327706",
        "1666192974313"
      ];

      // const allProducts: any = [];
      const dataSample = [
        "010b55-77-a803-40a8-35ad2e2e87",
        "03bf-61e8-aac8-1105-eafcb221834",
        "05eb6a5-2b2-de04-5330-735e65fa635",
        "07382-450b-ddf-2183-885f66152476",
        "07b71-4412-f732-457b-3c15162cd42c",
        "0bc373d-17d5-3311-6acd-3d0cf8787d3",
        "0c1b65a-263-ef7b-57b0-00c47758f20",
        "0ef233e-1f47-ff77-bbd8-530051c170af",
        "0efe012-e48b-e461-a706-05d1a252d25",
        "11606d2-85a-0fb2-ff3d-5c1c078116f",
        "12ce6d8-0416-f41-8bba-de831e87a62",
        "12f68a6-d484-07a-d285-633a3da155c0",
        "14f3de7-af41-64e6-b2f-c3ba631a34",
        "160f3ca-de8-3eb2-32bf-cd60e175bc71",
        "1665511925986",
        "1665518292872",
        "1665518333247",
        "1665565194343",
        "1665566175649",
        "1665566670773",
        "1665578327706",
        "1665594719470",
        "1665655129942",
        "1665660800327",
        "1665667504213",
        "1665668475991",
        "1665668896444",
        "1665753898062",
        "1665754039418",
        "1665754200443",
        "1665993169697",
        "1666022079234",
        "1666083154548",
        "1666084980756",
        "1666088024516",
        "1666088396345",
        "1666088531642",
        "1666088634537",
        "1666089677434",
        "1666089879079",
        "1666090252193",
        "1666090780666",
        "1666091484549",
        "1666091764158",
        "1666092366692",
        "1666092459042",
        "1666092755817",
        "1666092954212",
        "1666093082963",
        "1666093729703",
        "1666096690840",
        "1666097044427",
        "1666097113628",
        "1666097927266",
        "1666101196199",
        "1666101243568",
        "1666104620287",
        "1666172354769",
        "1666172676534",
        "1666174024458",
        "1666176886909",
        "1666179995264",
        "1666180336768",
        "1666180609635",
        "1666180829309",
        "1666181743590",
        "1666183348649",
        "1666183406850",
        "1666185478189",
        "1666185807548",
        "1666192974313",
        "1666202342120",
        "1666203040606",
        "1666203797942",
        "1666256357755",
        "1666258296108",
        "1666284474422",
        "1666356731805",
        "1666620654055",
        "1666620773824",
        "1b561-367d-d307-b72d-66a4f38f4ccf",
        "1df3c04-e26-1a2e-3e28-af817feca58e",
        "2008cba-ec-1cb1-0e5e-386ea0e28065",
        "20be80-cca3-afd-143c-3561b6f081a",
        "25d4108-178-7347-6ebf-b3f3454fe4f",
        "2736f10-074c-018b-ddee-423126705ea4",
        "274dc46-fdc-d11-cf8-175e68b2e32d",
        "28a84d5-df57-d21b-758f-13405cad44",
        "2c46552-17d0-2fb2-b12d-7e5bb1a7cace",
        "3504d-f41-352a-cdcf-4de26cdb5b0",
        "36482d-28d7-e424-a8d0-ce21c6872503",
        "371e76b-1ab6-7862-aa3-084ab2675e2",
        "37d43d-b0f4-8de6-d107-77abe8dcbdb",
        "38e6e0-b340-5af2-725-7d5bf1abfe01",
        "3bed7ed-2d44-0ec-2001-555e3dee27",
        "3ca1164-08d-58bb-8db7-db6dfffde4",
        "3fac4-7d00-fb5b-cd3a-740e83b14f",
        "4667458-8262-8a2d-135c-4c71cbbd538f",
        "472e3-586-7c80-c685-8ec6b852f8dd",
        "4aaaeb8-6362-c33-62a-cb48e7c82ae4"
      ];
      // const dataSample = ["2008cba-ec-1cb1-0e5e-386ea0e28065"];
      // const sample = await coreSDK?.getProductListWithVariants(dataSample);
      const allProducts: ProductWithVariants[] | null =
        (await coreSDK?.getProductListWithVariants(
          productsIds
        )) as ProductWithVariants[];
      console.log(
        "🚀  roberto --  ~ file: useProducts.ts ~ line 192 ~ allProducts",
        allProducts
      );
      // console.log(
      //   "🚀  roberto --  ~ file: useProducts.ts ~ line 87 ~ sample",
      //   sample
      // );
      // const response = allProducts.filter(
      //   (res: any) => res.status === "fulfilled"
      // ) as unknown as PromiseProps[];
      // console.log(
      //   "🚀  roberto --  ~ file: useProducts.ts ~ line 206 ~ response",
      //   response
      // );

      return allProducts;
      // return (response?.flatMap((p) => p?.value || null) || []).filter(
      //   (n) => n
      // ) as ProductWithVariants[];
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
        .filter((n) => n) || []
    );
  }, [productsWithVariants?.data, store?.rates, props?.quantityAvailable_gte]);

  const allSellers = useMemo(() => {
    const grouped = groupBy(allProducts, "seller.id") || {};
    return (
      Object.keys(grouped)?.map((brandName) => {
        const offers = grouped[brandName as keyof typeof grouped];
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
          offers
        };
      }) || []
    );
  }, [allProducts]);

  return {
    isLoading: products.isLoading || productsWithVariants.isLoading,
    isError: products.isError || productsWithVariants.isError,
    products: allProducts as unknown as ExtendedOffer[],
    sellers: allSellers as unknown as ExtendedSeller[]
  };
}
