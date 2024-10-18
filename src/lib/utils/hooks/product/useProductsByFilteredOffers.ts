import { useMemo } from "react";

import { isTruthy } from "../../../types/helpers";
import { useOffers } from "../offers";
import { UseOfferOptionsProps } from "../offers/types";
import useProducts from "./useProducts";

export default function useProductsByFilteredOffers(
  props: Parameters<typeof useOffers>[0] = {},
  options?: UseOfferOptionsProps
) {
  const { data, isLoading, isError } = useOffers(props, options);
  const productsIds = useMemo(
    // use product ids instead of uuids
    () =>
      Array.from(
        new Set(
          data
            ?.map((d) =>
              d?.metadata && "product" in d.metadata
                ? d.metadata.product?.id || null
                : null
            )
            .filter(isTruthy)
        )
      ) || [],
    [data]
  );
  const result = useProducts(
    {
      ...(props.first && { productsFirst: props.first }),
      productsIds: productsIds,
      onlyNotVoided: !props.voided,
      onlyValid: props.valid
    },
    { enableCurationList: true }
  );
  return {
    ...result,
    isLoading: isLoading || result.isLoading,
    isError: isError || result.isError
  };
}
