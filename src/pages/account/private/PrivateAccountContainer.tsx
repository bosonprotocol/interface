import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "state/hooks";
import styled from "styled-components";

import { Spinner } from "../../../components/loading/Spinner";
import { colors } from "../../../lib/styles/colors";
import { useBuyers } from "../../../lib/utils/hooks/useBuyers";
import NotFound from "../../not-found/NotFound";
import Buyer from "../../profile/buyer/Buyer";

const SpinnerWrapper = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${colors.secondary};
`;

export default function PrivateAccountContainer() {
  const { isActivating, account: address } = useWeb3React();
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

  if (isActivating || isLoading || !selectedWallet) {
    return (
      <SpinnerWrapper>
        <Spinner size={42} />
      </SpinnerWrapper>
    );
  }

  if (!address) {
    return <div>Please connect your wallet</div>;
  }
  if (!buyerId && isSuccess) {
    return <NotFound />;
  }

  return <Buyer buyerId={buyerId} />;
}
