import { useMemo } from "react";

import { useDisputeResolvers } from "./useDisputeResolvers";

export const useIsAdmin = (address?: string) => {
  const { data } = useDisputeResolvers();

  const isAdmin = useMemo(() => {
    const all = data?.disputeResolvers?.map((d) => d?.admin) || [];

    if (address && all.includes(address)) {
      return true;
    }
    return false;
  }, [data, address]);

  return isAdmin;
};
