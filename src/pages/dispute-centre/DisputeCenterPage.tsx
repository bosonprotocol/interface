import styled from "styled-components";
import { useAccount } from "wagmi";

import disputeResolutionBackground from "../../assets/background1.svg";
import { LayoutRoot } from "../../components/layout/Layout";
import DisputeListMobile from "../../components/modal/components/DisputeListMobile/DisputeListMobile";
import DisputeTable from "../../components/modal/components/DisputeTable/DisputeTable";
import { useModal } from "../../components/modal/useModal";
import Button from "../../components/ui/Button";
import Grid from "../../components/ui/Grid";
import GridContainer from "../../components/ui/GridContainer";
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

const DisputeListHeader = styled.div`
  background: ${colors.lightGrey};
  width: 100vw;
  translate: -50%;
  margin-left: 50%;
`;

const Image = styled.img`
  align-self: center;
  justify-self: flex-end;
`;

const DisputeListContainer = styled.div`
  min-height: calc(100vh - 489px);
  padding: 2rem 0;
`;

function DisputeCenterPage() {
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
      <DisputeListHeader>
        <LayoutRoot>
          <GridContainer itemsPerRow={{ xs: 1, s: 2, m: 2, l: 2, xl: 2 }}>
            <div style={{ padding: "3.5rem 0" }}>
              <Typography
                $fontSize="3.5rem"
                color={colors.black}
                fontWeight="600"
              >
                Boson Protocol
              </Typography>
              <Typography
                $fontSize="3.5rem"
                color={colors.black}
                fontWeight="600"
              >
                Dispute Resolution Center
              </Typography>
              <Grid
                $width="max-content"
                gap="1rem"
                justifyContent="flex-start"
                alignItems="flex-start"
                margin="1.875rem 0 0 0"
              >
                <Button
                  type="submit"
                  theme="primary"
                  onClick={() => {
                    navigate({
                      pathname: BosonRoutes.YourAccount,
                      search: `${AccountQueryParameters.tab}=${TabQueryParameters.exchange}`
                    });
                  }}
                >
                  Raise a dispute
                </Button>
                <Button
                  type="button"
                  theme="secondary"
                  onClick={() => {
                    showModal(modalTypes.RAISE_DISPUTE, {
                      title: "Raise a dispute"
                    });
                  }}
                >
                  How it works?
                </Button>
              </Grid>
            </div>
            <Image src={disputeResolutionBackground} width={392} height={392} />
          </GridContainer>
        </LayoutRoot>
      </DisputeListHeader>
      <DisputeListContainer>
        {
          // TODO: buyer funds only?
        }
        {myBuyerId && (
          <Grid justifyContent="flex-end" marginBottom="1rem">
            <Button
              theme="secondary"
              onClick={() => {
                showModal(
                  "MANAGE_FUNDS_MODAL",
                  {
                    title: "Manage Funds",
                    id: myBuyerId
                  },
                  "auto",
                  "dark"
                );
              }}
            >
              Withdraw buyer funds
            </Button>
          </Grid>
        )}
        {isLteS ? (
          <DisputeListMobile exchanges={exchanges} />
        ) : (
          <DisputeTable exchanges={exchanges} />
        )}
      </DisputeListContainer>
    </>
  );
}

export default DisputeCenterPage;
