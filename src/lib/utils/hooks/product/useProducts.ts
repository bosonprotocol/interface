import { subgraph } from "@bosonprotocol/react-kit";
import groupBy from "lodash/groupBy";
import { useMemo } from "react";
import { useQuery } from "react-query";

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

  const allProducts = useMemo(
    () =>
      productsWithVariants?.data?.map(({ product, variants }: any) => {
        return {
          ...(variants?.[0]?.offer || []),
          brandName: product?.brand?.name,
          additional: {
            variants,
            product
          }
        };
      }) || [],
    [productsWithVariants?.data]
  );
  const allSellers = useMemo(() => {
    const grouped = groupBy(allProducts, "brandName") || {};
    return (
      Object.keys(grouped)?.map((brandName) => {
        const offers = grouped[brandName as keyof typeof grouped];
        const seller = offers?.[0]?.seller || {};
        return {
          ...seller,
          brandName,
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
