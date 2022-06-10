import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

import { BosonRoutes } from "../../../lib/routing/routes";
import PrivateAccount from "./PrivateAccount";

export default function PrivateAccountContainer() {
  const { data: account, isLoading, isFetching, isError } = useAccount();
  const navigate = useNavigate();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isFetching) {
    return <div>Fetching...</div>;
  }

  if (isError) {
    return <div>There has been an error</div>;
  }

  if (!account?.address) {
    navigate(BosonRoutes.Root);
    return <div>Please connect your wallet</div>;
  }

  return <PrivateAccount account={account.address} />;
}
