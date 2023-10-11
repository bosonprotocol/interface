import { useAccount } from "lib/utils/hooks/connection/connection";
import { useEffect, useMemo } from "react";

import { useBuyerSellerAccounts } from "../lib/utils/hooks/useBuyerSellerAccounts";
import { useCurrentSellers } from "../lib/utils/hooks/useCurrentSellers";
import { UserRoles } from "./routes";

export const checkIfUserHaveRole = (
  roles: Array<string | null>,
  userRoles: Array<string | null>,
  fallback: boolean
) => roles?.some((r) => userRoles.includes(r)) || fallback;

interface Props {
  role: Array<string | null>;
}
export default function useUserRoles({ role }: Props) {
  // TODO: add admin role
  const MOCK_ADMIN = false;
  const { account: address } = useAccount();
  const {
    refetch,
    buyer: { buyerId }
  } = useBuyerSellerAccounts(address || "");
  const {
    sellerIds,
    isFetched,
    isFetching,
    isError,
    isLoading,
    isRefetching,
    isSuccess
  } = useCurrentSellers();
  const sellerId = useMemo(() => sellerIds?.[0], [sellerIds]);

  useEffect(() => {
    refetch();
  }, [address]); // eslint-disable-line

  const userRoles: (keyof typeof UserRoles)[] = useMemo(() => {
    const roles: (keyof typeof UserRoles)[] = [];
    if (address) {
      roles.push(UserRoles.Guest);
      if (buyerId) {
        roles.push(UserRoles.Buyer);
      }
      if (sellerId) {
        roles.push(UserRoles.Seller);
      }
      if (MOCK_ADMIN) {
        roles.push(UserRoles.DisputeResolver);
      }
    }
    return roles;
  }, [MOCK_ADMIN, address, buyerId, sellerId]);

  const isAuth = checkIfUserHaveRole(role, userRoles, true);

  return {
    roles: userRoles,
    address,
    isAuth,
    sellerId,
    buyerId,
    isFetched,
    isFetching,
    isError,
    isLoading,
    isRefetching,
    isSuccess
  };
}
