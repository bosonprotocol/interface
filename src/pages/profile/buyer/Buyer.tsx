import { DiscordLogo, Globe, ShareNetwork } from "phosphor-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAccount } from "wagmi";

import Avatar from "../../../components/avatar";
import { useModal } from "../../../components/modal/useModal";
import AddressText from "../../../components/offer/AddressText";
import Button from "../../../components/ui/Button";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
import { useBuyers } from "../../../lib/utils/hooks/useBuyers";
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
  GrayWrapper,
  ProfileSectionWrapper
} from "../ProfilePage.styles";
import Exchanges from "./Exchanges";

interface Props {
  manageFundsId?: string;
}

export default function Buyer({ manageFundsId }: Props) {
  const { address: currentWalletAddress = "" } = useAccount();
  const { [UrlParameters.buyerId]: urlBuyerId = "" } = useParams();

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

  const isMyBuyer =
    currentBuyerAddress.toLowerCase() === currentWalletAddress.toLowerCase();

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

  if (isLoadingBuyers) {
    // TODO: ADD LOADING INDICATOR
    return <p>Loading...</p>;
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
    // TODO: NO FIGMA REPRESENTATION
    return (
      <BasicInfo>
        <Typography tag="h2" margin="2rem auto">
          Buyer with this ID does not exist
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
              <Avatar address={currentBuyerAddress} size={160} />
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
                <Typography tag="h2" margin="1rem 0 0 0">
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
              {manageFundsId && (
                <Button theme="primary" onClick={handleManageFunds}>
                  Manage Funds
                </Button>
              )}
              <SocialIcons icons={socialIcons} />
            </Grid>
          </Grid>
        </ProfileSectionWrapper>
        <ProfileSectionWrapper>
          <ReadMore text="Designs unclear. Where should this text come from as the buyer has no metadata and no Lens profile for us to get this from." />
          <Typography tag="h2" $fontSize="2.25rem" margin="0 0 1rem 0">
            All exchanges
          </Typography>
        </ProfileSectionWrapper>
      </BasicInfo>
      <GrayWrapper>
        <ProfileSectionWrapper>
          <Exchanges
            buyerId={buyerId}
            action={null}
            isPrivateProfile={isMyBuyer}
          />
        </ProfileSectionWrapper>
      </GrayWrapper>
    </>
  );
}
