import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Fragment, useMemo, useState } from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";
dayjs.extend(isBetween);

import { UrlParameters } from "../../../../../lib/routing/parameters";
import { BosonRoutes } from "../../../../../lib/routing/routes";
import { colors } from "../../../../../lib/styles/colors";
import { zIndex } from "../../../../../lib/styles/zIndex";
import { getDateTimestamp } from "../../../../../lib/utils/getDateTimestamp";
import useProducts from "../../../../../lib/utils/hooks/product/useProducts";
import { useCurrentSellers } from "../../../../../lib/utils/hooks/useCurrentSellers";
import { useKeepQueryParamsNavigate } from "../../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import {
  ExtendedOffer,
  ExtendedSeller
} from "../../../../../pages/explore/WithAllOffers";
import Grid from "../../../../ui/Grid";
import Image from "../../../../ui/Image";
import Typography from "../../../../ui/Typography";

const CardContainer = styled.div`
  position: relative;
  padding-bottom: 7.8125rem;
  background: ${colors.lightGrey};
  display: flex;
  flex-direction: column;
  border: 1px solid ${colors.black}20;
  transition: all 300ms ease-in-out;
  box-shadow: 0px 4px 110px rgb(21 30 52 / 10%);
  &:hover {
    box-shadow: 0px 0px 0px rgb(0 0 0 / 5%), 4px 4px 4px rgb(0 0 0 / 5%),
      8px 8px 8px rgb(0 0 0 / 5%), 16px 16px 16px rgb(0 0 0 / 5%);
    img[data-testid] {
      transform: translate(-50%, -50%) scale(1.05);
    }
  }
`;
const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 0;
  margin: 0;
  overflow: hidden;
`;

const DataContainer = styled.div`
  padding: 1rem 1.5rem 1rem 1.5rem;
  background: ${colors.white};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.OfferCard};
`;

const StyledGrid = styled(Grid)`
  max-width: 6.5625rem;
`;

interface Props {
  collection: ExtendedSeller;
}
const imagesNumber = 4;
export default function CollectionsCard({ collection }: Props) {
  const [sellerId] = useState<string>(collection.id);
  const { lens: lensProfiles } = useCurrentSellers({
    sellerId
  });
  const [lens] = lensProfiles;
  const navigate = useKeepQueryParamsNavigate();

  const { sellers: sellersProducts } = useProducts(
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

  const products = useMemo(() => {
    return (sellersProducts.filter((s) => s.id === sellerId) || []).map(
      (sellerProducts) => {
        sellerProducts.products = sellerProducts.products?.reduce(
          (acc, elem) => {
            const isHasBeenBought = !!elem.exchanges?.length;
            const nowDate = dayjs();

            const isFullyVoided = elem.additional?.variants.every((variant) => {
              return !!variant.voidedAt;
            });

            // all products that are not fully voided and still have valid variants/offers
            const isStillHaveValid =
              !isFullyVoided &&
              elem.additional?.variants.some((variant) => {
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
              });

            // all products that have been fully voided, only and only if there exist at least 1 exchange for at least 1 of the variants/offer (whatever the status of this exchange)
            const isFullyVoidedAndBought = isFullyVoided && isHasBeenBought;

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

  const allExchanges = useMemo(
    () => collection.numExchanges || 0,
    [collection]
  );
  const images = useMemo(() => {
    const array = (collection && collection?.additional?.images) || [];

    if (array.length < 3) {
      for (let index = 0; index < imagesNumber; index++) {
        array.push("");
      }
    }

    return array.slice(0, imagesNumber);
  }, [collection]);

  return (
    <CardContainer
      onClick={() => {
        navigate({
          pathname: generatePath(BosonRoutes.SellerPage, {
            [UrlParameters.exchangeId]: collection.id
          })
        });
      }}
    >
      <ImagesContainer>
        {images &&
          images?.map(
            (img: string, index: number) =>
              img !== "" && (
                <Fragment key={`CollectionsCardImage_${index}`}>
                  <Image src={img} optimizationOpts={{ height: 500 }} />
                </Fragment>
              )
          )}
      </ImagesContainer>
      <DataContainer>
        <div>
          <Typography
            color={colors.black}
            $fontSize="1.25rem"
            fontWeight="600"
            margin="0 0 0.625rem 0"
          >
            {lens?.name ? lens?.name : `Seller ID: ${collection.id}`}
          </Typography>
          <StyledGrid alignItems="flex-start" margin="0 0 0.3125rem 0">
            <Typography
              $fontSize="12px"
              fontWeight="400"
              color={colors.darkGrey}
            >
              Products
            </Typography>
            <Typography
              $fontSize="12px"
              fontWeight="400"
              color={colors.darkGrey}
              margin="0 0 0 25px"
            >
              Sold
            </Typography>
          </StyledGrid>
          <StyledGrid alignItems="flex-start">
            <Typography $fontSize="20px" fontWeight="600" color={colors.black}>
              {(products?.[0]?.products || [])?.length || 0}
            </Typography>
            <Typography
              $fontSize="20px"
              fontWeight="600"
              color={colors.black}
              margin="0 0 0 25px"
            >
              {allExchanges}
            </Typography>
          </StyledGrid>
        </div>
      </DataContainer>
    </CardContainer>
  );
}
