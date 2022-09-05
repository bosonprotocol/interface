import Avatar from "@davatar/react";
import { DiscordLogo, Globe, ShareNetwork } from "phosphor-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import AddressText from "../../../components/offer/AddressText";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
import { useSellerCalculations } from "../../../lib/utils/hooks/useSellerCalculations";
import { useSellers } from "../../../lib/utils/hooks/useSellers";
import placeHolderSrc from "../common/image12.png";
import ReadMore from "../common/ReadMore";
import SocialIcons from "../common/SocialIcons";
import {
  AddressContainer,
  AvatarContainer,
  AvatarEmptySpace,
  BannerImage,
  BannerImageLayer,
  BasicInfo,
  ProfileSectionWrapper
} from "../ProfilePage.styles";
import Tabs from "./Tabs";

const SellerCalculationContainer = styled.div`
  margin-bottom: 2rem;
  width: 100%;
`;

export default function Seller() {
  const { address: currentWalletAddress = "" } = useAccount();
  const { [UrlParameters.sellerId]: sellerId = "" } = useParams();
  const {
    data: sellers = [],
    isError: isErrorSellers,
    isLoading: isLoadingSellers
  } = useSellers(
    {
      id: sellerId
    },
    {
      enabled: !!sellerId
    }
  );
  const {
    data: { exchanges = [], offers = [] } = {},
    isError: isErrorSellerCalculation,
    isLoading: isLoadingSellersCalculation
  } = useSellerCalculations(
    {
      sellerId
    },
    {
      enabled: !!sellerId
    }
  );
  const isSellerExists = !!sellers?.length;
  const currentSellerAddress = sellers[0]?.operator || "";
  const isMySeller =
    currentSellerAddress.toLowerCase() === currentWalletAddress.toLowerCase();

  console.log({
    sellerId,
    currentSellerAddress,
    currentWalletAddress,
    isMySeller
  });

  const socialIcons = useMemo(() => {
    return [
      {
        id: 1,
        icon: <DiscordLogo size={24} />,
        isDisabled: true,
        href: ""
      },
      {
        id: 2,
        icon: <Globe size={24} />,
        isDisabled: true,
        href: ""
      },
      {
        id: 3,
        icon: <ShareNetwork size={24} />,
        isDisabled: false,
        href: window.location.href
      }
    ];
  }, []);

  const owners = useMemo(() => {
    return [
      ...Array.from(new Set(exchanges.map((exchange) => exchange.buyer.id)))
    ].length;
  }, [exchanges]);

  if (isLoadingSellers || isLoadingSellersCalculation) {
    // TODO: ADD LOADING INDICATOR
    return <p>Loading...</p>;
  }

  if (isErrorSellers || isErrorSellerCalculation) {
    // TODO: NO FIGMA REPRESENTATION
    return (
      <BasicInfo>
        <Typography tag="h2" margin="2rem auto">
          There has been an error...
        </Typography>
      </BasicInfo>
    );
  }

  if (!isSellerExists) {
    // TODO: NO FIGMA REPRESENTATION
    return (
      <BasicInfo>
        <Typography tag="h2" margin="2rem auto">
          Seller with this ID does not exist
        </Typography>
      </BasicInfo>
    );
  }

  return (
    <>
      <BasicInfo>
        <ProfileSectionWrapper>
          <BannerImage src={placeHolderSrc} />
          <BannerImageLayer>
            <AvatarContainer>
              <Avatar address={currentSellerAddress} size={160} />
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
                <Typography tag="h2" margin="0.5rem 0 0 0">
                  Mekaverse Where should this text come from ? or Seller with
                  id: {sellerId}
                </Typography>
                <Grid alignItems="center" justifyContent="flex-start">
                  <Typography tag="p" margin="0 0.5rem 0 0">
                    @mekaverse.lens
                  </Typography>
                  <AddressContainer>
                    <AddressText address={currentSellerAddress} />
                  </AddressContainer>
                </Grid>
              </div>
            </Grid>
            <Grid
              justifyContent="flex-end"
              $width="auto"
              margin="1.25rem 0 0 0"
            >
              <SocialIcons icons={socialIcons} />
            </Grid>
          </Grid>
        </ProfileSectionWrapper>
        <ProfileSectionWrapper>
          <ReadMore text="Where should this text come from Where should this text come from Where should this text come from Where should this text come from Where should this text come from Where should this text come from" />
        </ProfileSectionWrapper>
      </BasicInfo>
      <ProfileSectionWrapper>
        <SellerCalculationContainer>
          <Grid justifyContent="space-between" alignItems="flex-end">
            <Grid justifyContent="flex-start" alignItems="flex-end">
              <Grid justifyContent="flex-start" gap="4rem">
                <div>
                  <Typography tag="p" $fontSize="0.75rem" margin="0">
                    Items
                  </Typography>
                  <Typography
                    tag="p"
                    $fontSize="1.25rem"
                    margin="0"
                    fontWeight="bold"
                  >
                    {offers.length}
                  </Typography>
                </div>
                <div>
                  <Typography tag="p" $fontSize="0.75rem" margin="0">
                    Sold
                  </Typography>
                  <Typography
                    tag="p"
                    $fontSize="1.25rem"
                    margin="0"
                    fontWeight="bold"
                  >
                    {exchanges.length}
                  </Typography>
                </div>
                <div>
                  <Typography tag="p" $fontSize="0.75rem" margin="0">
                    Owners
                  </Typography>
                  <Typography
                    tag="p"
                    $fontSize="1.25rem"
                    margin="0"
                    fontWeight="bold"
                  >
                    {owners}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </SellerCalculationContainer>
        <Tabs
          isPrivateProfile={isMySeller}
          sellerId={sellerId}
          isErrorSellers={isErrorSellers}
        />
      </ProfileSectionWrapper>
    </>
  );
}
