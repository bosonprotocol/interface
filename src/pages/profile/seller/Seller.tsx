import Avatar from "@davatar/react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { BigNumber } from "ethers";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useAccount } from "wagmi";
dayjs.extend(isBetween);

import {
  getLensCoverPictureUrl,
  getLensProfilePictureUrl,
  isMatchingLensHandle
} from "../../../components/modal/components/CreateProfile/Lens/utils";
import AddressText from "../../../components/offer/AddressText";
import Grid from "../../../components/ui/Grid";
import Image from "../../../components/ui/Image";
import Loading from "../../../components/ui/Loading";
import Typography from "../../../components/ui/Typography";
import { UrlParameters } from "../../../lib/routing/parameters";
import { breakpoint } from "../../../lib/styles/breakpoint";
import { colors } from "../../../lib/styles/colors";
import { getDateTimestamp } from "../../../lib/utils/getDateTimestamp";
import {
  MediaSet,
  Profile,
  ProfileFieldsFragment
} from "../../../lib/utils/hooks/lens/graphql/generated";
import useGetLensProfiles from "../../../lib/utils/hooks/lens/profile/useGetLensProfiles";
import useProducts from "../../../lib/utils/hooks/product/useProducts";
import { useBreakpoints } from "../../../lib/utils/hooks/useBreakpoints";
import { useCurrentSellers } from "../../../lib/utils/hooks/useCurrentSellers";
import { useSellerCalculations } from "../../../lib/utils/hooks/useSellerCalculations";
import { useSellers } from "../../../lib/utils/hooks/useSellers";
import { getLensImageUrl } from "../../../lib/utils/images";
import { ExtendedOffer } from "../../explore/WithAllOffers";
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
    sellers: sellersData
  } = useCurrentSellers(lensTokenId ? { lensTokenId } : { sellerId });
  sellerId = sellersData?.length ? sellersData[0].id : sellerId;
  const [sellerLens] = sellersLens;
  const coverImage = getLensImageUrl(getLensCoverPictureUrl(sellerLens));

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
    sellers: sellersProducts,
    isLoading: isLoadingProducts,
    isError: isErrorProducts
  } = useProducts(
    {
      productsFilter: {
        sellerId
      }
    },
    {
      enableCurationList: false,
      withNumExchanges: true
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

  const products = useMemo(() => {
    return (sellersProducts.filter((s) => s.id === sellerId) || []).map(
      (sellerProducts) => {
        sellerProducts.products = sellerProducts.products?.reduce(
          (acc, elem) => {
            const isHasBeenBought = !!elem.exchanges?.length;
            const nowDate = dayjs();

            // all products that still have valid variants/offers
            const isStillHaveValid = elem.additional?.variants.some(
              (variant) => {
                const validFromDateParsed = dayjs(
                  Number(variant?.validFromDate) * 1000
                );
                const validUntilDateParsed = dayjs(
                  Number(variant?.validUntilDate) * 1000
                );
                return nowDate.isBetween(
                  validFromDateParsed,
                  validUntilDateParsed,
                  "day",
                  "[]"
                );
              }
            );

            // all products that have been fully voided, only and only if there exist at least 1 exchange for at least 1 of the variants/offer (whatever the status of this exchange)
            const isFullyVoidedAndBought =
              elem.additional?.variants.every((variant) => {
                return !!variant.voidedAt;
              }) && isHasBeenBought;

            // all products where all variants are not yet valid
            const isAllVariantsInProductNotValidYet =
              elem.additional?.variants.every((variant) => {
                return dayjs(getDateTimestamp(variant?.validFromDate)).isAfter(
                  nowDate
                );
              });

            // all products where all variants are expired, only and only if there exist at least 1 exchange for at least 1 offer (whatever the status of this exchange)
            const isAllVariantsInProductAreExpiredAndBought =
              elem.additional?.variants.every((variant) => {
                return dayjs(
                  getDateTimestamp(variant?.validUntilDate)
                ).isBefore(nowDate);
              }) && isHasBeenBought;

            if (
              isStillHaveValid ||
              isFullyVoidedAndBought ||
              isAllVariantsInProductNotValidYet ||
              isAllVariantsInProductAreExpiredAndBought
            ) {
              acc.push(elem);
            }
            return acc;
          },
          [] as ExtendedOffer[]
        );
        // REASSIGN OFFERS for compatibility with previous code
        sellerProducts.offers = sellerProducts.products;
        return sellerProducts;
      }
    );
  }, [sellerId, sellersProducts]);

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
  const avatar = getLensImageUrl(getLensProfilePictureUrl(sellerLens));
  return (
    <>
      <BasicInfo>
        <ProfileSectionWrapper>
          <BannerImage src={coverImage || backgroundFluid} />
          <BannerImageLayer>
            <AvatarContainer>
              {(sellerLens?.picture as MediaSet) ? (
                <StyledImage
                  src={avatar}
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
                  {sellerLens?.name}
                </Typography>
                <Grid
                  alignItems={!isLteXS ? "center" : "flex-start"}
                  justifyContent="flex-start"
                  flexDirection={!isLteXS ? "row" : "column"}
                >
                  <LensTitle tag="p">{sellerLens?.handle}</LensTitle>
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
              <FollowLens>
                <a
                  href={`https://lenster.xyz/u/${sellerLens?.handle}`}
                  target="_blank"
                  rel="noopener"
                >
                  Follow
                </a>
              </FollowLens>
              <SellerSocial
                sellerLens={sellerLens as ProfileFieldsFragment}
                voucherCloneAddress={sellersData?.[0]?.voucherCloneAddress}
              />
            </Grid>
          </Grid>
        </ProfileSectionWrapper>
        <ProfileSectionWrapper>
          {sellerLens?.bio && <ReadMore text={sellerLens?.bio} />}
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
                    {(products?.[0]?.products || [])?.length || 0}
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
                    {sellersProducts?.[0]?.numExchanges ?? 0}
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
