import Avatar from "@davatar/react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import AddressText from "../../../components/offer/AddressText";
import Grid from "../../../components/ui/Grid";
import Image from "../../../components/ui/Image";
import Loading from "../../../components/ui/Loading";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { MediaSet } from "../../../lib/utils/hooks/lens/graphql/generated";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useCurrentSeller } from "../../../lib/utils/hooks/useCurrentSeller";
import { useSellerCalculations } from "../../../lib/utils/hooks/useSellerCalculations";
import { useSellers } from "../../../lib/utils/hooks/useSellers";
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
  ProfileSectionWrapper
} from "../ProfilePage.styles";
import SellerSocial from "./SellerSocial";
import Tabs from "./Tabs";

const SellerCalculationContainer = styled.div`
  margin-bottom: 2rem;
  width: 100%;
`;

const LensTitle = styled(Typography)`
  font-weight: bold;
  margin: 0.5rem 0 0 0;
  color: ${colors.darkGrey};
  ${breakpoint.s} {
    margin: 0 0.5rem 0 0;
    font-size: 1rem;
  }
`;

export default function Seller() {
  const { address: currentWalletAddress = "" } = useAccount();
  const { [UrlParameters.sellerId]: sellerId = "" } = useParams();
  const { isLteXS } = useBreakpoints();

  const {
    isLoading,
    isError,
    lens: sellerLens
  } = useCurrentSeller({
    sellerId
  });

  console.log("sellerLens", sellerLens);
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
    data: { exchanges, offers = [] } = {},
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

  const owners = useMemo(() => {
    return [
      ...Array.from(
        new Set((exchanges || []).map((exchange) => exchange.buyer.id))
      )
    ].length;
  }, [exchanges]);

  if (isLoading || isLoadingSellers || isLoadingSellersCalculation) {
    return <Loading />;
  }

  if (isError || isErrorSellers || isErrorSellerCalculation) {
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
    return <NotFound />;
  }

  return (
    <>
      <BasicInfo>
        <ProfileSectionWrapper>
          <BannerImage
            src={
              (sellerLens?.coverPicture as MediaSet)?.original?.url ||
              backgroundFluid
            }
          />
          <BannerImageLayer>
            <AvatarContainer>
              {(sellerLens?.picture as MediaSet) ? (
                <Image
                  src={(sellerLens?.picture as MediaSet)?.original?.url}
                  style={{
                    width: "160px !important",
                    height: "160px !important",
                    paddingTop: "0",
                    borderRadius: "50%"
                  }}
                />
              ) : (
                <Avatar
                  address={currentSellerAddress}
                  size={!isLteXS ? 160 : 80}
                />
              )}
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
                  {sellerLens?.name || "Placeholder Name (work in progress)"}
                </Typography>
                <Grid
                  alignItems={!isLteXS ? "center" : "flex-start"}
                  justifyContent="flex-start"
                  flexDirection={!isLteXS ? "row" : "column"}
                >
                  <LensTitle tag="p">
                    {sellerLens?.handle || "@placeholder.lens"}
                  </LensTitle>
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
              <SellerSocial sellerLens={sellerLens} />
            </Grid>
          </Grid>
        </ProfileSectionWrapper>
        <ProfileSectionWrapper>
          {/* TODO: ADD MISSING TEXT */}
          <ReadMore
            text={
              sellerLens?.bio ||
              "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
            }
          />
        </ProfileSectionWrapper>
      </BasicInfo>
      <ProfileSectionWrapper>
        <SellerCalculationContainer>
          <Grid justifyContent="space-between" alignItems="flex-end">
            <Grid justifyContent="flex-start" alignItems="flex-end">
              <Grid
                justifyContent={!isLteXS ? "flex-start" : "space-between"}
                gap="4rem"
              >
                <div>
                  <Typography
                    tag="p"
                    $fontSize={!isLteXS ? "0.75rem" : "1.25rem"}
                    margin="0"
                    color={colors.darkGrey}
                  >
                    Offers
                  </Typography>
                  <Typography
                    tag="p"
                    $fontSize={!isLteXS ? "1.25rem" : "1.7rem"}
                    margin="0"
                    fontWeight="bold"
                  >
                    {offers.length}
                  </Typography>
                </div>
                <div>
                  <Typography
                    tag="p"
                    $fontSize={!isLteXS ? "0.75rem" : "1.25rem"}
                    margin="0"
                    color={colors.darkGrey}
                  >
                    Sold
                  </Typography>
                  <Typography
                    tag="p"
                    $fontSize={!isLteXS ? "1.25rem" : "1.7rem"}
                    margin="0"
                    fontWeight="bold"
                  >
                    {exchanges?.length ?? 0}
                  </Typography>
                </div>
                <div>
                  <Typography
                    tag="p"
                    $fontSize={!isLteXS ? "0.75rem" : "1.25rem"}
                    margin="0"
                    color={colors.darkGrey}
                  >
                    Owners
                  </Typography>
                  <Typography
                    tag="p"
                    $fontSize={!isLteXS ? "1.25rem" : "1.7rem"}
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
