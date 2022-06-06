import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

import { UrlParameters } from "../../../lib/routing/query-parameters";
import PrivateAccount from "../private/PrivateAccount";
import PublicAccount from "./PublicAccount";

export default function PublicOrPrivateAccount() {
  const { [UrlParameters.accountId]: accountParameter } = useParams();
  const address = accountParameter || "";

  const { data: account, isLoading, isFetching, isError } = useAccount();

  const connectedAddress = account?.address || "";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isFetching) {
    return <div>Fetching...</div>;
  }

  if (isError) {
    return <div>There has been an error</div>;
  }

  if (connectedAddress.toLowerCase() === address.toLowerCase()) {
    return <PrivateAccount account={address} />;
  }

  return <PublicAccount />;
}
