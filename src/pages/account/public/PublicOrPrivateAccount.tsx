import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

import Loading from "../../../components/ui/Loading";
import { UrlParameters } from "../../../lib/routing/parameters";
import PrivateAccount from "../private/PrivateAccount";
import PublicAccount from "./PublicAccount";

export default function PublicOrPrivateAccount() {
  const { [UrlParameters.accountId]: accountParameter } = useParams();
  const address = accountParameter || "";

  const { address: account, isConnecting, isReconnecting } = useAccount();

  const connectedAddress = account || "";

  if (isConnecting || isReconnecting) {
    return <Loading />;
  }

  if (connectedAddress.toLowerCase() === address.toLowerCase()) {
    return <PrivateAccount account={address} />;
  }

  return <PublicAccount />;
}
