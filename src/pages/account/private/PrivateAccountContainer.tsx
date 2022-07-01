import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../lib/routing/routes";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import PrivateAccount from "./PrivateAccount";

export default function PrivateAccountContainer() {
  const { address, isConnecting, isReconnecting, isDisconnected } =
    useAccount();
  const navigate = useKeepQueryParamsNavigate();
  if (isConnecting || isReconnecting) {
    return <div>Loading...</div>;
  }

  if (!address || isDisconnected) {
    navigate({ pathname: BosonRoutes.Root });
    return <div>Please connect your wallet</div>;
  }

  return <PrivateAccount account={address} />;
}
