import { hooks } from "@bosonprotocol/react-kit";
import { useWeb3React } from "@web3-react/core";
import { ConnectWalletErrorMessage } from "components/error/ConnectWalletErrorMessage";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { useAppSelector } from "state/hooks";

import { useBuyers } from "../../../lib/utils/hooks/useBuyers";
import Buyer from "../../profile/buyer/Buyer";

export default function PrivateAccountContainer() {
  const { isActivating } = useWeb3React();
  const { account: address } = useAccount();
  const isMagicLoggedIn = hooks.useIsMagicLoggedIn();
  const selectedWallet = useAppSelector((state) => state.user.selectedWallet);

  const {
    data: buyers,
    isLoading,
    isSuccess
  } = useBuyers(
    {
      wallet: address
    },
    {
      enabled: !!address
    }
  );

  const buyerId = buyers?.[0]?.id || "";

  if (isActivating || isLoading || (!selectedWallet && !isMagicLoggedIn)) {
    return <LoadingMessage />;
  }

  if (!address) {
    return <ConnectWalletErrorMessage />;
  }

  if (!buyerId && isSuccess) {
    return (
      <EmptyErrorMessage
        title="You have no exchanges yet"
        message="Commit to some products to see your chat conversations"
      />
    );
  }

  return <Buyer buyerId={buyerId} />;
}
