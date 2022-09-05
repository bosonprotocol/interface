import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../lib/routing/routes";
import { useBuyers } from "../../../lib/utils/hooks/useBuyers";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import NotFound from "../../not-found/NotFound";
import Buyer from "../../profile/buyer/Buyer";

export default function PrivateAccountContainer() {
  const { address, isConnecting, isReconnecting, isDisconnected } =
    useAccount();

  const navigate = useKeepQueryParamsNavigate();
  const { data: buyers, isLoading } = useBuyers({
    wallet: address
  });

  const buyerId = buyers?.[0]?.id || "";

  if (isConnecting || isReconnecting || isLoading) {
    return <div>Loading...</div>;
  }

  if (!address || isDisconnected) {
    navigate({ pathname: BosonRoutes.Root });
    return <div>Please connect your wallet</div>;
  }
  if (!buyerId) {
    return <NotFound />;
  }

  return <Buyer manageFundsId={buyerId} />;
}
