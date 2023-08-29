import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

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
  const { account: address, isActivating } = useWeb3React();

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

  if (isActivating || isLoading) {
    return (
      <SpinnerWrapper>
        <Spinner size={42} />
      </SpinnerWrapper>
    );
  }

  if (!address) {
    navigate({ pathname: BosonRoutes.Root });
    return <div>Please connect your wallet</div>;
  }
  if (!buyerId) {
    return <NotFound />;
  }

  return <Buyer buyerId={buyerId} />;
}
