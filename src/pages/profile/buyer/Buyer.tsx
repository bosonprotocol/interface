import { EmptyErrorMessage } from "components/error/EmptyErrorMessage";
import { LoadingMessage } from "components/loading/LoadingMessage";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";

import whiteImg from "../../../assets/white.jpeg";
import Avatar from "../../../components/avatar";
import DetailShare from "../../../components/detail/DetailShare";
import { useModal } from "../../../components/modal/useModal";
import AddressText from "../../../components/offer/AddressText";
import BosonButton from "../../../components/ui/BosonButton";
import { Grid } from "../../../components/ui/Grid";
import { Typography } from "../../../components/ui/Typography";
import {
  AccountQueryParameters,
  UrlParameters
} from "../../../lib/routing/parameters";
import { useQueryParameter } from "../../../lib/routing/useQueryParameter";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useBuyers } from "../../../lib/utils/hooks/useBuyers";
import { useCustomStoreQueryParameter } from "../../custom-store/useCustomStoreQueryParameter";
import {
  AddressContainer,
  AvatarContainer,
  AvatarEmptySpace,
  BannerImage,
  BannerImageLayer,
  BasicInfo,
  DetailShareWrapper,
  GrayWrapper,
  ProfileSectionWrapper,
  SocialIconContainer
} from "../ProfilePage.styles";
import Exchanges from "./Exchanges";

interface Props {
  buyerId?: string;
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
const ManageFundsButton = styled(BosonButton)<{ $isCustomStoreFront: boolean }>`
  ${({ $isCustomStoreFront }) => {
    if (!$isCustomStoreFront) {
      return "";
    }
    return css`
      color: var(--accent);
      border-color: var(--accent);
      hover: {
        background: var(--accent);
      }
    `;
  }};
`;

export default function Buyer({ buyerId: buyerIdProp }: Props) {
  const { [UrlParameters.buyerId]: urlBuyerId = "" } = useParams();
  const isCustomStoreFront = useCustomStoreQueryParameter("isCustomStoreFront");
  const { isLteXS } = useBreakpoints();
  const buyerId = buyerIdProp || urlBuyerId;
  const [manageFunds, setManageFundsQueryParam] = useQueryParameter(
    AccountQueryParameters.manageFunds
  );
  const openManageFunds = manageFunds === "true";
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

  const handleManageFunds = useCallback(() => {
    if (buyerIdProp) {
      showModal(
        modalTypes.MANAGE_FUNDS_MODAL,
        {
          title: "Manage Funds",
          id: buyerIdProp
        },
        "auto",
        "dark"
      );
    }
  }, [buyerIdProp, modalTypes.MANAGE_FUNDS_MODAL, showModal]);
  useEffect(() => {
    if (openManageFunds) {
      setManageFundsQueryParam(null, {
        replace: true
      });
      handleManageFunds();
    }
  }, [handleManageFunds, openManageFunds, setManageFundsQueryParam]);
  if (isLoadingBuyers) {
    return <LoadingMessage />;
  }

  if (isErrorBuyers) {
    return (
      <EmptyErrorMessage
        title="Error"
        message="Please try refreshing this page"
      />
    );
  }

  if (!isBuyerExists && !buyerIdProp) {
    return (
      <EmptyErrorMessage
        title="You have no exchanges yet"
        message="Commit to some products to see your chat conversations"
      />
    );
  }

  return (
    <>
      <BasicInfo>
        <ProfileSectionWrapper>
          <BannerImage src={whiteImg} />
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
              width="auto"
            >
              <AvatarEmptySpace />
              <div>
                <Typography
                  tag="h2"
                  margin={!isLteXS ? "1rem 0 0 0" : "0.25rem 0 0.25rem 0"}
                  fontSize={!isLteXS ? "2rem" : "1.675rem"}
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
            <Grid justifyContent="flex-end" width="auto" margin="1.25rem 0 0 0">
              {buyerIdProp && !isLteXS && (
                <ManageFundsButton
                  $isCustomStoreFront={!!isCustomStoreFront}
                  variant="accentInverted"
                  onClick={handleManageFunds}
                >
                  Manage Funds
                </ManageFundsButton>
              )}
              <SocialIconContainer>
                <DetailShareWrapper>
                  <DetailShare />
                </DetailShareWrapper>
              </SocialIconContainer>
            </Grid>
          </Grid>
          {buyerIdProp && isLteXS && (
            <ManageFundMobileWrapper>
              <ManageFundsButton
                $isCustomStoreFront={!!isCustomStoreFront}
                variant="accentInverted"
                onClick={handleManageFunds}
                data-manage-funds-button
              >
                Manage Funds
              </ManageFundsButton>
            </ManageFundMobileWrapper>
          )}
        </ProfileSectionWrapper>
        <ProfileSectionWrapper>
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
