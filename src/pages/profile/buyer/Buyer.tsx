import { useParams } from "react-router-dom";

import Avatar from "../../../components/avatar";
import DetailShare from "../../../components/detail/DetailShare";
import { Spinner } from "../../../components/loading/Spinner";
import { useModal } from "../../../components/modal/useModal";
import AddressText from "../../../components/offer/AddressText";
import Button from "../../../components/ui/Button";
import Grid from "../../../components/ui/Grid";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
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

export default function Buyer({ manageFundsId }: Props) {
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
              <SocialIconContainer>
                <DetailShareWrapper>
                  <DetailShare />
                </DetailShareWrapper>
              </SocialIconContainer>
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
          <Exchanges buyerId={buyerId} />
        </ProfileSectionWrapper>
      </GrayWrapper>
    </>
  );
}
