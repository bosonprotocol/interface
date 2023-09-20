import { useWeb3React } from "@web3-react/core";
import { useAccount } from "lib/utils/hooks/ethers/connection";
import { useParams } from "react-router-dom";

import Loading from "../../../components/ui/Loading";
import { UrlParameters } from "../../../lib/routing/parameters";
import PrivateAccount from "../private/PrivateAccount";
import PublicAccount from "./PublicAccount";

export default function PublicOrPrivateAccount() {
  const { [UrlParameters.accountId]: accountParameter } = useParams();
  const address = accountParameter || "";

  const { isActivating } = useWeb3React();
  const { account } = useAccount();

  const connectedAddress = account || "";

  if (isActivating) {
    return <Loading />;
  }

  if (connectedAddress.toLowerCase() === address.toLowerCase()) {
    return <PrivateAccount account={address} />;
  }

  return <PublicAccount />;
}
