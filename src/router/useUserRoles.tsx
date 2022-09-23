import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";

import { useBuyerSellerAccounts } from "../lib/utils/hooks/useBuyerSellerAccounts";
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
    seller: { sellerId },
    buyer: { buyerId }
  } = useBuyerSellerAccounts(address || "");

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
    isAuth
  };
}
