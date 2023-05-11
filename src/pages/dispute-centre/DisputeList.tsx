import { ButtonSize } from "@bosonprotocol/react-kit";
import styled from "styled-components";
import { useAccount } from "wagmi";

import DisputeListMobile from "../../components/modal/components/DisputeListMobile/DisputeListMobile";
import DisputeTable from "../../components/modal/components/DisputeTable/DisputeTable";
import { useModal } from "../../components/modal/useModal";
import BosonButton from "../../components/ui/BosonButton";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import {
  AccountQueryParameters,
  TabQueryParameters
} from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyers } from "../../lib/utils/hooks/useBuyers";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

const DisputeListContainer = styled.div`
  background: ${colors.lightGrey};
  min-height: calc(100vh - 489px);
  padding: 2rem 0;
`;

const DisputeListHeader = styled.div<{ isLteS: boolean }>`
  max-width: 65.625rem;
  margin: 0 auto;
  padding-top: ${({ isLteS }) => (isLteS ? "2.5rem" : "3.125rem")};
  padding-bottom: ${({ isLteS }) => (isLteS ? "1.5625rem" : "2rem")};
  max-width: ${({ isLteS }) => (isLteS ? "100%" : "65.625rem")};
  display: ${({ isLteS }) => isLteS && "block"};
  background: ${({ isLteS }) => isLteS && colors.lightGrey};
  :first-child {
    max-width: ${({ isLteS }) => isLteS && "25rem"};
    background: ${({ isLteS }) => isLteS && colors.white};
    display: ${({ isLteS }) => isLteS && "block"};
    margin: ${({ isLteS }) => isLteS && "0 auto"};
    padding: ${({ isLteS }) => isLteS && "1.25rem"};
  }
`;

const SubmitButton = styled(BosonButton)`
  div {
    font-weight: 600;
  }
`;

const HowItWorksButton = styled(Button)`
  border: 2px solid ${colors.secondary};
  color: ${colors.secondary};
  div {
    font-weight: 600;
  }
`;

function DisputeList() {
  const navigate = useKeepQueryParamsNavigate();
  const { showModal, modalTypes } = useModal();
  const { isLteS } = useBreakpoints();
  const { address } = useAccount();
  const { data: buyers = [] } = useBuyers(
    {
      wallet: address
    },
    {
      enabled: !!address
    }
  );
  const myBuyerId = buyers[0]?.id;
  const { data: exchanges = [] } = useExchanges(
    {
      disputed: true,
      buyerId: myBuyerId
    },
    {
      enabled: !!myBuyerId
    }
  );
  return (
    <>
      <DisputeListHeader isLteS={isLteS}>
        <span>
          <Typography $fontSize="2rem" color={colors.black} fontWeight="600">
            Dispute resolution center
          </Typography>
          <Typography $fontSize="1.25rem" color={colors.darkGrey}>
            Raise and resolve problems of your exchanges.
          </Typography>
          <Grid
            $width="max-content"
            gap="1rem"
            justifyContent="flex-start"
            alignItems="flex-start"
            margin="1.875rem 0 0 0"
          >
            <SubmitButton
              type="submit"
              variant="primaryFill"
              size={ButtonSize.Small}
              onClick={() => {
                navigate({
                  pathname: BosonRoutes.YourAccount,
                  search: `${AccountQueryParameters.tab}=${TabQueryParameters.exchange}`
                });
              }}
            >
              Submit an issue
            </SubmitButton>
            <HowItWorksButton
              type="button"
              theme="outline"
              size="small"
              onClick={() => {
                showModal(modalTypes.RAISE_DISPUTE, {
                  title: "Raise a problem"
                });
              }}
            >
              How it works?
            </HowItWorksButton>
          </Grid>
        </span>
      </DisputeListHeader>
      <DisputeListContainer>
        {isLteS ? (
          <DisputeListMobile exchanges={exchanges} />
        ) : (
          <DisputeTable exchanges={exchanges} />
        )}
      </DisputeListContainer>
    </>
  );
}

export default DisputeList;
