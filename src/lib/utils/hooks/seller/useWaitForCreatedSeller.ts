import { useEffect, useState } from "react";

import { useAccount } from "../connection/connection";
import { useCurrentSellers } from "../useCurrentSellers";

export const useWaitForCreatedSeller = () => {
  const { account: address } = useAccount();
  const { sellers, refetch, ...rest } = useCurrentSellers();
  const seller = sellers.find((seller) => {
    return seller?.assistant.toLowerCase() === address?.toLowerCase();
  });
  const [stopInterval, setStopInterval] = useState(false);
  useEffect(() => {
    if (!seller && !stopInterval) {
      const intervalObj = setInterval(() => {
        refetch()
          .then((results) => {
            const [resultByAddress] = results;
            if (resultByAddress.status === "fulfilled") {
              const val = resultByAddress.value;
              if (val) {
                const hasSellers = val.data?.sellers?.length;
                if (hasSellers) {
                  setStopInterval(true);
                }
              }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }, 1000);
      return () => {
        clearInterval(intervalObj);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seller, stopInterval]);
  return {
    ...rest,
    seller
  };
};
