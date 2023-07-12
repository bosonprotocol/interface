import styled from "styled-components";
import { useAccount } from "wagmi";

import { Spinner } from "../../../components/loading/Spinner";
import { BosonRoutes } from "../../../lib/routing/routes";
import { colors } from "../../../lib/styles/colors";
import { useBuyers } from "../../../lib/utils/hooks/useBuyers";
import { useKeepQueryParamsNavigate } from "../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import NotFound from "../../not-found/NotFound";
import Buyer from "../../profile/buyer/Buyer";

const SpinnerWrapper = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${colors.secondary};
`;

export default function PrivateAccountContainer() {
  const { address, isConnecting, isReconnecting, isDisconnected } =
    useAccount();

  const navigate = useKeepQueryParamsNavigate();
  const { data: buyers, isLoading } = useBuyers(
    {
      wallet: address
    },
    {
      enabled: !!address
    }
  );

  const buyerId = buyers?.[0]?.id || "";

  if (isConnecting || isReconnecting || isLoading) {
    return (
      <SpinnerWrapper>
        <Spinner size={42} />
      </SpinnerWrapper>
    );
  }

  if (!address || isDisconnected) {
    navigate({ pathname: BosonRoutes.Root });
    return <div>Please connect your wallet</div>;
  }
  if (!buyerId) {
    return <NotFound />;
  }

  return <Buyer buyerId={buyerId} />;
}
