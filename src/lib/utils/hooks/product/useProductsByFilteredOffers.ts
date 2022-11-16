import { useMemo } from "react";

import { isTruthy } from "../../../types/helpers";
import { useOffers } from "../offers";
import useInfinityProducts from "./useInfinityProducts";

export default function useProductsByFilteredOffers(
  props: Parameters<typeof useOffers>[0] = {}
) {
  const { data, isLoading, isError } = useOffers({ ...props, first: 200 });
  const productsIds = useMemo(
    () =>
      Array.from(
        new Set(
          data?.map((d) => d?.metadata?.product?.uuid || null).filter(isTruthy)
        )
      ) || [],
    [data]
  );
  const result = useInfinityProducts(
    {
      ...(props.first && { productsFirst: props.first }),
      productsIds: productsIds
    },
    { enableCurationList: true }
  );
  return {
    ...result,
    isLoading: isLoading || result.isLoading,
    isError: isError || result.isError
  };
}
