import { Button } from "@bosonprotocol/react-kit";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import Avatar from "../../../components/avatar";
import DetailShare from "../../../components/detail/DetailShare";
import { Spinner } from "../../../components/loading/Spinner";
import { useModal } from "../../../components/modal/useModal";
import AddressText from "../../../components/offer/AddressText";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useBuyers } from "../../../lib/utils/hooks/useBuyers";
import NotFound from "../../not-found/NotFound";
import backgroundFluid from "../common/background-img.png";
import ReadMore from "../common/ReadMore";
import {
  AddressContainer,
  AvatarContainer,
  AvatarEmptySpace,
  BannerImage,
  BannerImageLayer,
  BasicInfo,
  DetailShareWrapper,
  GrayWrapper,
  LoadingWrapper,
  ProfileSectionWrapper,
  SocialIconContainer
} from "../ProfilePage.styles";
import Exchanges from "./Exchanges";

interface Props {
  manageFundsId?: string;
}

const ManageFundMobileWrapper = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  [data-manage-funds-button] {
    width: 100%;
    padding: 1.05rem 2rem;
    [data-child-wrapper-button] {
      text-align: center;
      display: block;
    }
  }
`;

const AllExchangesTitle = styled(Typography)`
  margin: 0.25rem 0 0.25rem 0;
  font-size: 1.7rem;
  justify-content: center;
  padding-bottom: 3rem;
  ${breakpoint.s} {
    margin: 1rem 0 0 0;
    font-size: 2.25rem;
    justify-content: flex-start;
    padding-bottom: 2rem;
  }
`;
const ExchangesWrapper = styled(Typography)`
  display: block;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  ${breakpoint.s} {
    padding-left: 0;
    padding-right: 0;
  }
`;

export default function Buyer({ manageFundsId }: Props) {
  const { [UrlParameters.buyerId]: urlBuyerId = "" } = useParams();
  const { isLteXS } = useBreakpoints();
  const buyerId = manageFundsId || urlBuyerId;
  const {
    data: buyers,
    isError: isErrorBuyers,
    isLoading: isLoadingBuyers
  } = useBuyers(
    {
      id: buyerId
    },
    {
      enabled: !!buyerId
    }
  );
  const { showModal, modalTypes } = useModal();
  const isBuyerExists = !!buyers?.length;
  const currentBuyerAddress = buyers?.[0]?.wallet || "";

  const handleManageFunds = () => {
    if (manageFundsId) {
      showModal(
        modalTypes.MANAGE_FUNDS_MODAL,
        {
          title: "Manage Funds",
          id: manageFundsId
        },
        "auto",
        "dark"
      );
    }
  };
  if (isLoadingBuyers) {
    return (
      <LoadingWrapper>
        <Spinner size={44} />
      </LoadingWrapper>
    );
  }

  if (isErrorBuyers) {
    return (
      <BasicInfo>
        <Typography tag="h2" margin="2rem auto">
          There has been an error...
        </Typography>
      </BasicInfo>
    );
  }

  if (!isBuyerExists && !manageFundsId) {
    return <NotFound />;
  }

  return (
    <>
      <BasicInfo>
        <ProfileSectionWrapper>
          <BannerImage src={backgroundFluid} />
          <BannerImageLayer>
            <AvatarContainer>
              <Avatar
                address={currentBuyerAddress}
                size={!isLteXS ? 160 : 80}
              />
            </AvatarContainer>
          </BannerImageLayer>
        </ProfileSectionWrapper>
        <ProfileSectionWrapper>
          <Grid justifyContent="space-between" alignItems="flex-start">
            <Grid
              justifyContent="flex-start"
              alignItems="flex-end"
              $width="auto"
            >
              <AvatarEmptySpace />
              <div>
                <Typography
                  tag="h2"
                  margin={!isLteXS ? "1rem 0 0 0" : "0.25rem 0 0.25rem 0"}
                  $fontSize={!isLteXS ? "2rem" : "1.675rem"}
                >
                  Buyer ID: {buyerId}
                </Typography>
                <Grid alignItems="flex-start">
                  <AddressContainer>
                    <AddressText address={currentBuyerAddress} />
                  </AddressContainer>
                </Grid>
              </div>
            </Grid>
            <Grid
              justifyContent="flex-end"
              $width="auto"
              margin="1.25rem 0 0 0"
            >
              {manageFundsId && !isLteXS && (
                <Button variant="accentInverted" onClick={handleManageFunds}>
                  Manage Funds
                </Button>
              )}
              <SocialIconContainer>
                <DetailShareWrapper>
                  <DetailShare />
                </DetailShareWrapper>
              </SocialIconContainer>
            </Grid>
          </Grid>
          {manageFundsId && isLteXS && (
            <ManageFundMobileWrapper>
              <Button
                variant="accentInverted"
                onClick={handleManageFunds}
                data-manage-funds-button
              >
                Manage Funds
              </Button>
            </ManageFundMobileWrapper>
          )}
        </ProfileSectionWrapper>
        <ProfileSectionWrapper>
          <ReadMore text="Designs unclear. Where should this text come from as the buyer has no metadata and no Lens profile for us to get this from." />
          <AllExchangesTitle tag="h2">All exchanges</AllExchangesTitle>
        </ProfileSectionWrapper>
      </BasicInfo>
      <GrayWrapper>
        <ProfileSectionWrapper>
          <ExchangesWrapper>
            <Exchanges buyerId={buyerId} />
          </ExchangesWrapper>
        </ProfileSectionWrapper>
      </GrayWrapper>
    </>
  );
}
