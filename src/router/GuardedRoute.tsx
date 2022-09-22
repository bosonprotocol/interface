import { useAccount } from "wagmi";

import Navigate from "../components/customNavigation/Navigate";
import { BosonRoutes } from "../lib/routing/routes";
import { useBuyerSellerAccounts } from "../lib/utils/hooks/useBuyerSellerAccounts";
import { UserRoles } from "./routes";

interface Props {
  children: JSX.Element;
  role: Array<keyof typeof UserRoles>;
}
export default function GuardedRoute({ role, children }: Props) {
  const MOCK_ADMIN = true;
  const { address, isConnected } = useAccount();
  const {
    seller: { sellerId },
    buyer: { buyerId }
  } = useBuyerSellerAccounts(address || "");

  const auth = [
    isConnected && UserRoles.Guest,
    buyerId && UserRoles.Buyer,
    sellerId && UserRoles.Seller,
    MOCK_ADMIN && UserRoles.DisputeResolver
  ];
  const isAuth = role.some((r: string) => auth.includes(r));

  return isAuth ? children : <Navigate to={{ pathname: BosonRoutes.Root }} />;
}
