import { useMemo } from "react";
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
import Loading from "../../components/ui/Loading";
import Typography from "../../components/ui/Typography";
import {
  AccountQueryParameters,
  TabQueryParameters
} from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../lib/utils/hooks/useBuyerSellerAccounts";
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
  const { buyer, seller } = useBuyerSellerAccounts(address);
  const myBuyerId = buyer.buyerId;
  const mySellerId = seller.sellerId;

  const { data: buyerExchanges, isLoading: isBuyersLoading } = useExchanges(
    {
      disputed: true,
      buyerId: myBuyerId
    },
    {
      enabled: !!myBuyerId
    }
  );
  const { data: sellerExchanges, isLoading: isSellersLoading } = useExchanges(
    {
      disputed: true,
      sellerId: mySellerId
    },
    {
      enabled: !!mySellerId
    }
  );
  const exchanges = useMemo(() => {
    return Array.from(
      new Map(
        [...(buyerExchanges || []), ...(sellerExchanges || [])].map((v) => [
          v.id,
          v
        ])
      ).values()
    );
  }, [buyerExchanges, sellerExchanges]);
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
                  disabled={!myBuyerId}
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
                    showModal(
                      modalTypes.RAISE_DISPUTE,
                      {
                        title: "Dispute process"
                      },
                      "auto",
                      undefined,
                      {
                        l: "1000px"
                      }
                    );
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
        <Grid justifyContent="flex-end" gap="1rem" marginBottom="1rem">
          {myBuyerId && (
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
              Withdraw {mySellerId ? "buyer" : ""} funds
            </Button>
          )}
          {mySellerId && (
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
              Withdraw {myBuyerId ? "seller" : ""} funds
            </Button>
          )}
        </Grid>
        {isBuyersLoading || isSellersLoading ? (
          <Loading />
        ) : (
          <>
            {exchanges.length ? (
              <>
                {isLteS ? (
                  <DisputeListMobile exchanges={exchanges} />
                ) : (
                  <DisputeTable exchanges={exchanges} />
                )}
              </>
            ) : (
              <Typography>No disputes found</Typography>
            )}
          </>
        )}
      </DisputeListContainer>
    </>
  );
}

export default DisputeCenterPage;
