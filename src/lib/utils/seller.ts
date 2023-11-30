import { subgraph } from "@bosonprotocol/react-kit";

import { useCurrentSellers } from "./hooks/useCurrentSellers";
import { poll } from "./promises";

const DEFAULT_ATTEMPTS = 15;
const DEFAULT_MS_BETWEEN_ATTEMPS = 600;
type SellerWithSomeFields = Pick<subgraph.SellerFieldsFragment, "metadata">;
export const refetchSellerPolling = async ({
  refetch,
  attempts = DEFAULT_ATTEMPTS,
  msBetweenAttemps = DEFAULT_MS_BETWEEN_ATTEMPS,
  propertyToCheck
}: {
  refetch: ReturnType<typeof useCurrentSellers>["refetch"];
  attempts?: number;
  msBetweenAttemps?: number;
  propertyToCheck?: keyof SellerWithSomeFields;
}) => {
  let attempsCounter = attempts || DEFAULT_ATTEMPTS;
  const ms = msBetweenAttemps || DEFAULT_MS_BETWEEN_ATTEMPS;
  const checkSellerProperty = (
    s: Partial<Record<keyof SellerWithSomeFields, unknown>> | undefined
  ) => {
    return propertyToCheck ? s?.[propertyToCheck] : !!s;
  };
  await poll(
    async () => {
      attempsCounter--;
      return await refetch();
    },
    (refetchResult) => {
      const [resultByAddress, , , resultRefetchFetchSellers, resultSellerById] =
        refetchResult;
      let isSet = false;
      if (resultByAddress.status === "fulfilled" && resultByAddress.value) {
        isSet = !!resultByAddress.value.data?.sellers?.some((s) =>
          checkSellerProperty(s)
        );
      }
      if (
        !isSet &&
        resultRefetchFetchSellers.status === "fulfilled" &&
        resultRefetchFetchSellers.value
      ) {
        isSet = !!resultRefetchFetchSellers.value.data?.some((s) =>
          checkSellerProperty(s)
        );
      }
      if (
        !isSet &&
        resultSellerById.status === "fulfilled" &&
        resultSellerById.value
      ) {
        isSet = !!checkSellerProperty(resultSellerById.value.data);
      }
      return attempsCounter > 0 && !isSet;
    },
    ms
  );
};
