import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";

import { useBuyerSellerAccounts } from "../lib/utils/hooks/useBuyerSellerAccounts";
import { useCurrentSellers } from "../lib/utils/hooks/useCurrentSellers";
import { useIsSellerInCuractionList } from "../lib/utils/hooks/useSellers";
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
  const { address } = useAccount();
  const {
    refetch,
    buyer: { buyerId }
  } = useBuyerSellerAccounts(address || "");
  const { sellerIds } = useCurrentSellers();
  const sellerId = useMemo(() => sellerIds?.[0], [sellerIds]);
  const isSellerInCurationList = useIsSellerInCuractionList(sellerId);

  useEffect(() => {
    refetch();
  }, [address]); // eslint-disable-line

  const userRoles: Array<string> = useMemo(() => {
    const roles = [];
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
    isSellerInCurationList,
    isAuth
  };
}
