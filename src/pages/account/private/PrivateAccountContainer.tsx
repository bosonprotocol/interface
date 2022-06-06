import { useAccount } from "wagmi";

import PrivateAccount from "./PrivateAccount";

export default function PrivateAccountContainer() {
  const { data: account, isLoading, isFetching, isError } = useAccount();

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
    return <div>Please connect your wallet</div>;
  }

  return <PrivateAccount account={account.address} />;
}
