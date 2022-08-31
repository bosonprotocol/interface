import React from "react";
import styled from "styled-components";
import { useAccount } from "wagmi";

import DisputeListMobile from "../../components/modal/components/DisputeListMobile/DisputeListMobile";
import DisputeTable from "../../components/modal/components/DisputeTable/DisputeTable";
import { useModal } from "../../components/modal/useModal";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import Typography from "../../components/ui/Typography";
import { AccountQueryParameters } from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyers } from "../../lib/utils/hooks/useBuyers";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { useKeepQueryParamsNavigate } from "../../lib/utils/hooks/useKeepQueryParamsNavigate";

const DisputeListContainer = styled.div`
  background: ${colors.lightGrey};
  min-height: calc(100vh - 489px);
  padding-bottom: 3.125rem;
`;

const DisputeListHeader = styled.div<{ isMobile: boolean }>`
  max-width: 65.625rem;
  margin: 0 auto;
  padding-top: ${({ isMobile }) => (isMobile ? "2.5rem" : "3.125rem")};
  padding-bottom: ${({ isMobile }) => (isMobile ? "1.5625rem" : "2rem")};
  max-width: ${({ isMobile }) => (isMobile ? "100%" : "65.625rem")};
  display: ${({ isMobile }) => isMobile && "block"};
  background: ${({ isMobile }) => isMobile && colors.lightGrey};
  span {
    max-width: ${({ isMobile }) => isMobile && "25rem"};
    background: ${({ isMobile }) => isMobile && colors.white};
    display: ${({ isMobile }) => isMobile && "block"};
    margin: ${({ isMobile }) => isMobile && "0 auto"};
    padding: ${({ isMobile }) => isMobile && "1.25rem"};
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 1.875rem;
  margin-right: 0.9375rem;
  div {
    font-weight: 600;
  }
`;

const HowItWorksButton = styled(Button)`
  border: 2px solid ${colors.secondary};
  color: ${colors.secondary};
  margin-top: 1.875rem;
  div {
    font-weight: 600;
  }
`;

function DisputeList() {
  const navigate = useKeepQueryParamsNavigate();
  const { showModal, modalTypes } = useModal();
  const { address } = useAccount();
  const { data: buyers } = useBuyers({
    wallet: address
  });
  const buyerId = buyers?.[0]?.id || "";
  const { isLteS } = useBreakpoints();

  const { data: exchanges = [] } = useExchanges({
    disputed: false
  });

  return (
    <>
      <DisputeListHeader isMobile={isLteS}>
        <span>
          <Typography $fontSize="2rem" color={colors.black} fontWeight="600">
            Dispute resolution center
          </Typography>
          <Typography $fontSize="1.25rem" color={colors.darkGrey}>
            Raise and resolve problems of your exchanges.
          </Typography>
          <Grid $width="max-content">
            <SubmitButton
              type="submit"
              theme="secondary"
              size="small"
              onClick={() => {
                navigate({
                  pathname: BosonRoutes.YourAccount,
                  search: `${AccountQueryParameters.tab}=exchange` // TODO CHANGE EXCHANGE TO CONST
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
