import { ConnectWalletErrorMessage } from "components/error/ConnectWalletErrorMessage";
import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { useAccount } from "lib/utils/hooks/connection/connection";
import { useMemo } from "react";
import styled from "styled-components";

import disputeResolutionBackground from "../../assets/background1.svg";
import { LayoutRoot } from "../../components/layout/Layout";
import DisputeListMobile from "../../components/modal/components/DisputeListMobile/DisputeListMobile";
import DisputeTable from "../../components/modal/components/DisputeTable/DisputeTable";
import { useModal } from "../../components/modal/useModal";
import Button from "../../components/ui/Button";
import { Grid } from "../../components/ui/Grid";
import Loading from "../../components/ui/Loading";
import { Typography } from "../../components/ui/Typography";
import {
  AccountQueryParameters,
  TabQueryParameters
} from "../../lib/routing/parameters";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import { useBuyerSellerAccounts } from "../../lib/utils/hooks/useBuyerSellerAccounts";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import { goToViewMode, ViewMode } from "../../lib/viewMode";

const DisputeListHeader = styled.div`
  background: ${colors.greyLight};
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
  margin-bottom: 2rem;
  overflow: auto;
`;

const CustomGridContainer = styled.div`
  display: grid;

  grid-column-gap: 1rem;
  grid-row-gap: 1rem;

  grid-template-columns: repeat(1, minmax(0, 1fr));
  img {
    justify-self: center;
  }
  ${breakpoint.xs} {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-column-gap: 4rem;
  }
  ${breakpoint.s} {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-column-gap: 4rem;
  }
  ${breakpoint.m} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-column-gap: 4rem;
    img {
      justify-self: flex-end;
    }
  }
  ${breakpoint.l} {
    grid-template-columns: max-content minmax(0, 1fr);
    grid-column-gap: 4rem;
    img {
      justify-self: flex-end;
    }
  }
  ${breakpoint.xl} {
    grid-template-columns: max-content minmax(0, 1fr);
    grid-column-gap: 4rem;
    img {
      justify-self: flex-end;
    }
  }
`;

const NoDisputes = styled(EmptyErrorMessage)`
  .title {
    font-size: 2.5rem;
  }
`;

function DisputeCenterPage() {
  const { showModal, modalTypes } = useModal();
  const { isLteS } = useBreakpoints();
  const { account } = useAccount();
  const { buyer, seller } = useBuyerSellerAccounts(account);
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
    ).sort((a, b) => Number(b.disputedDate) - Number(a.disputedDate));
  }, [buyerExchanges, sellerExchanges]);
  const isLoading =
    isBuyersLoading || isSellersLoading || buyer.isLoading || seller.isLoading;
  return (
    <>
      <DisputeListHeader>
        <LayoutRoot>
          <CustomGridContainer>
            <div style={{ padding: "3.5rem 0" }}>
              <Typography
                fontSize="3.5rem"
                color={colors.black}
                fontWeight="600"
              >
                Boson Protocol
              </Typography>
              <Typography
                fontSize="3.5rem"
                color={colors.black}
                fontWeight="600"
              >
                Dispute Resolution Center
              </Typography>
              <Grid
                width="max-content"
                gap="1rem"
                justifyContent="flex-start"
                alignItems="flex-start"
                margin="1.875rem 0 0 0"
              >
                <Button
                  type="submit"
                  themeVal="primary"
                  disabled={!myBuyerId}
                  onClick={() => {
                    goToViewMode(
                      ViewMode.DAPP,
                      `${BosonRoutes.YourAccount}?${AccountQueryParameters.tab}=${TabQueryParameters.exchange}`
                    );
                  }}
                >
                  Raise a dispute
                </Button>
                <Button
                  type="button"
                  themeVal="secondary"
                  onClick={() => {
                    showModal(
                      modalTypes.RAISE_DISPUTE,
                      {
                        title: "Dispute mutual resolution process"
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
          </CustomGridContainer>
        </LayoutRoot>
      </DisputeListHeader>
      {account ? (
        <>
          <Grid
            justifyContent="flex-end"
            gap="1rem"
            marginBottom="2rem"
            marginTop="2rem"
          >
            {myBuyerId && (
              <Button
                themeVal="secondary"
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
                themeVal="secondary"
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
          <DisputeListContainer>
            {!isLteS && isLoading ? (
              <Loading />
            ) : (
              <>
                {isLoading || exchanges.length ? (
                  <>
                    {isLteS ? (
                      <DisputeListMobile
                        exchanges={exchanges}
                        isLoading={isLoading}
                      />
                    ) : (
                      <DisputeTable exchanges={exchanges} />
                    )}
                  </>
                ) : (
                  <NoDisputes
                    title="No disputes found"
                    message="Once you redeem an exchange, you'll be able to raise a dispute"
                  />
                )}
              </>
            )}
          </DisputeListContainer>
        </>
      ) : (
        <ConnectWalletErrorMessage message="Please connect your wallet to display your disputes" />
      )}
    </>
  );
}

export default DisputeCenterPage;
