import { useMemo } from "react";

import { isTruthy } from "../../../types/helpers";
import { useOffers } from "../offers";
import useProducts from "./useProducts";

export default function useProductsByFilteredOffers(
  props: Parameters<typeof useOffers>[0] = {}
) {
  const { data } = useOffers(props);
  const productsIds = useMemo(
    () =>
      Array.from(
        new Set(
          data?.map((d) => d?.metadata?.product?.uuid || null).filter(isTruthy)
        )
      ) || [],
    [data]
  );
  return useProducts({
    productsIds: productsIds
  });
}
