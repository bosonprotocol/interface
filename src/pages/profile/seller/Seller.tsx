import Avatar from "@davatar/react";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";

import { EditProfile } from "../../../components/detail/EditProfile";
import { ProfileType } from "../../../components/modal/components/Profile/const";
import {
  getLensCoverPictureUrl,
  getLensProfilePictureUrl,
  isMatchingLensHandle
} from "../../../components/modal/components/Profile/Lens/utils";
import AddressText from "../../../components/offer/AddressText";
import Grid from "../../../components/ui/Grid";
import Image from "../../../components/ui/Image";
import Loading from "../../../components/ui/Loading";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import {
  Profile,
  ProfileFieldsFragment
} from "../../../lib/utils/hooks/lens/graphql/generated";
import useGetLensProfiles from "../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useCurrentSellers } from "../../../lib/utils/hooks/useCurrentSellers";
import { useSellerCalculations } from "../../../lib/utils/hooks/useSellerCalculations";
import useSellerNumbers from "../../../lib/utils/hooks/useSellerNumbers";
import { useSellers } from "../../../lib/utils/hooks/useSellers";
import { getLensImageUrl } from "../../../lib/utils/images";
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
  font-weight: 600;
  margin: 0.5rem 0 0 0;
  color: ${colors.darkGrey};
  ${breakpoint.s} {
    margin: 0 0.5rem 0 0;
    font-size: 1rem;
  }
`;

const StyledImage = styled(Image)`
  img {
    object-fit: contain;
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 100%;
  }
`;

const FollowLens = styled.div`
  margin-left: 0.75rem;
  padding: 0.25rem 1rem;
  border: 2px solid ${colors.secondary};
  color: ${colors.secondary};
  cursor: pointer;
  :hover {
    color: ${colors.white};
    background: ${colors.secondary};
    a {
      color: ${colors.white};
    }
  }
  a {
    color: ${colors.secondary};
    :hover {
      background: ${colors.secondary};
      color: ${colors.white};
    }
  }
`;

export default function Seller() {
  const { address: currentWalletAddress = "" } = useAccount();
  let { [UrlParameters.sellerId]: sellerId = "" } = useParams();
  let lensHandle: string | null = null;
  if (isMatchingLensHandle(sellerId)) {
    // Find sellerId based on LENS handle
    lensHandle = sellerId;
  }
  // Check the sellerID has correct format
  try {
    BigNumber.from(sellerId);
  } catch (e) {
    sellerId = "";
  }
  const resultLens = useGetLensProfiles(
    {
      handles: [lensHandle]
    },
    {
      enabled: !!lensHandle
    }
  );
  const lensProfiles: Profile[] = useMemo(() => {
    return (resultLens?.data?.items as Profile[]) ?? [];
  }, [resultLens?.data]);
  const lensTokenId = useMemo(() => {
    if (lensProfiles && lensProfiles.length > 0) {
      return lensProfiles[0].id;
    }
    return null;
  }, [lensProfiles]);
  const { isLteXS } = useBreakpoints();
  const {
    isLoading,
    isError,
    lens: sellersLens,
    sellers: sellersData,
    refetch
  } = useCurrentSellers(lensTokenId ? { lensTokenId } : { sellerId });
  const seller = sellersData[0];
  const metadata = seller?.metadata;
  const [sellerLens] = sellersLens;
  const useLens = !metadata || metadata?.kind === ProfileType.LENS;
  sellerId = sellersData?.length ? sellersData[0].id : sellerId;
  const lensCoverImage = getLensImageUrl(getLensCoverPictureUrl(sellerLens));
  const avatar = getLensImageUrl(getLensProfilePictureUrl(sellerLens));

  const name =
    (useLens ? sellerLens?.name : metadata?.name) ?? metadata?.name ?? "";
  const description =
    (useLens ? sellerLens?.bio : metadata?.description) ??
    metadata?.description ??
    "";
  const regularCoverImage = metadata?.images?.find(
    (img) => img.tag === "cover"
  )?.url;
  const coverImage =
    (useLens ? lensCoverImage : regularCoverImage) ?? regularCoverImage;
  const regularProfileImage = metadata?.images?.find(
    (img) => img.tag === "profile"
  )?.url;
  const profileImage =
    (useLens ? avatar : regularProfileImage) ?? regularProfileImage;

  const {
    data: sellers = [],
    isError: isErrorSellers,
    isLoading: isLoadingSellers
  } = useSellers(
    {
      id: sellerId,
      enableCurationList: false
    },
    {
      enabled: !!sellerId
    }
  );

  const {
    data: { exchanges } = {},
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

  const {
    numbers: { exchanges: numExchanges, products: numProducts },
    products,
    isError: isErrorProducts,
    isLoading: isLoadingProducts
  } = useSellerNumbers(sellerId);
  const currentSellerAddress = sellers[0]?.assistant || "";
  const isMySeller =
    currentSellerAddress.toLowerCase() === currentWalletAddress.toLowerCase();
  const isSellerExists = isMySeller ? !!sellersData.length : !!sellers?.length;

  const owners = useMemo(() => {
    return [
      ...Array.from(
        new Set((exchanges || []).map((exchange) => exchange.buyer.id))
      )
    ].length;
  }, [exchanges]);

  if (
    isLoading ||
    isLoadingSellers ||
    isLoadingSellersCalculation ||
    isLoadingProducts
  ) {
    return <Loading />;
  }

  if (
    isError ||
    isErrorSellers ||
    isErrorSellerCalculation ||
    isErrorProducts
  ) {
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
          <BannerImage src={coverImage || backgroundFluid} />
          <BannerImageLayer>
            <AvatarContainer>
              {profileImage ? (
                <StyledImage
                  src={profileImage}
                  style={{
                    width: "160px !important",
                    height: "160px !important",
                    paddingTop: "0",
                    borderRadius: "50%",
                    backgroundColor: "var(--primaryBgColor)"
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
              flexGrow="1"
            >
              <AvatarEmptySpace />
              <Grid flexDirection="column" alignItems="flex-start">
                <Typography
                  tag="h2"
                  margin={!isLteXS ? "1rem 0 0 0" : "0.25rem 0 0.25rem 0"}
                  $fontSize={!isLteXS ? "2rem" : "1.675rem"}
                >
                  {name}
                </Typography>
                <Grid
                  alignItems={!isLteXS ? "center" : "flex-start"}
                  justifyContent="flex-start"
                  flexDirection={!isLteXS ? "row" : "column"}
                >
                  {useLens && (
                    <LensTitle tag="p">{sellerLens?.handle}</LensTitle>
                  )}
                  <AddressContainer>
                    <AddressText address={currentSellerAddress} />
                  </AddressContainer>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              justifyContent="flex-end"
              $width="auto"
              margin="1.25rem 0 0 0"
            >
              <>
                {sellerLens && useLens && (
                  <FollowLens>
                    <a
                      href={`https://lenster.xyz/u/${sellerLens?.handle}`}
                      target="_blank"
                      rel="noopener"
                    >
                      Follow
                    </a>
                  </FollowLens>
                )}
                {isMySeller && (
                  <div style={{ marginLeft: "1.5rem" }}>
                    <EditProfile onClose={refetch} />
                  </div>
                )}
                <SellerSocial
                  seller={seller}
                  sellerLens={sellerLens as ProfileFieldsFragment}
                  voucherCloneAddress={sellersData?.[0]?.voucherCloneAddress}
                />
              </>
            </Grid>
          </Grid>
        </ProfileSectionWrapper>
        <ProfileSectionWrapper>
          <ReadMore text={description} />
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
                    Products
                  </Typography>
                  <Typography
                    tag="p"
                    $fontSize={!isLteXS ? "1.25rem" : "1.7rem"}
                    margin="0"
                    fontWeight="600"
                  >
                    {numProducts || 0}
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
                    fontWeight="600"
                  >
                    {numExchanges || 0}
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
                    fontWeight="600"
                  >
                    {owners}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </SellerCalculationContainer>
        <Tabs
          products={products?.[0]}
          isPrivateProfile={isMySeller}
          sellerId={sellerId}
          isErrorSellers={isErrorSellers}
        />
      </ProfileSectionWrapper>
    </>
  );
}
