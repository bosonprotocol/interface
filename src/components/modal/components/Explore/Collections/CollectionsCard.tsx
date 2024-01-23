import { AuthTokenType, subgraph } from "@bosonprotocol/react-kit";
import { Fragment, useMemo, useState } from "react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";

import { UrlParameters } from "../../../../../lib/routing/parameters";
import { BosonRoutes } from "../../../../../lib/routing/routes";
import { colors } from "../../../../../lib/styles/colors";
import { zIndex } from "../../../../../lib/styles/zIndex";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { useKeepQueryParamsNavigate } from "../../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import useSellerNumbers from "../../../../../lib/utils/hooks/useSellerNumbers";
import { useCustomStoreQueryParameter } from "../../../../../pages/custom-store/useCustomStoreQueryParameter";
import { ExtendedSeller } from "../../../../../pages/explore/WithAllOffers";
import { Grid } from "../../../../ui/Grid";
import Image from "../../../../ui/Image";
import { Typography } from "../../../../ui/Typography";

const CardContainer = styled.div<{
  $isUpperCardBgColorDefined: boolean;
}>`
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
  ${({ $isUpperCardBgColorDefined }) => {
    if ($isUpperCardBgColorDefined) {
      return css`
        background: var(--upperCardBgColor);
      `;
    }
    return css``;
  }}
`;
const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 0;
  margin: 0;
  overflow: hidden;
`;

const DataContainer = styled.div<{
  $isLowerCardBgColorDefined: boolean;
}>`
  padding: 1rem 1.5rem 1rem 1.5rem;
  background: ${colors.white};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.OfferCard};

  ${({ $isLowerCardBgColorDefined }) => {
    if ($isLowerCardBgColorDefined) {
      return css`
        color: var(--textColor);

        background: var(--lowerCardBgColor);

        * {
          color: var(--textColor);
        }
      `;
    }
    return css``;
  }}
`;

const StyledGrid = styled(Grid)`
  max-width: 6.5625rem;
`;

interface Props {
  collection: ExtendedSeller;
  lensProfile?: Profile;
}
const imagesNumber = 4;
export default function CollectionsCard({ collection, lensProfile }: Props) {
  const [sellerId] = useState<string>(collection.id);

  const {
    numbers: { products: numProducts }
  } = useSellerNumbers(sellerId);

  const seller = collection as unknown as subgraph.Seller;
  const metadata = seller?.metadata;

  const useLens = seller?.authTokenType === AuthTokenType.LENS;

  const name =
    (useLens ? lensProfile?.name : metadata?.name) ??
    metadata?.name ??
    `Seller ID: ${collection.id}`;
  const navigate = useKeepQueryParamsNavigate();

  const images = useMemo(() => {
    const array = (collection && collection?.additional?.images) || [];

    if (array.length < 3) {
      for (let index = 0; index < imagesNumber; index++) {
        array.push("");
      }
    }

    return array.slice(0, imagesNumber);
  }, [collection]);
  const upperCardBgColor = useCustomStoreQueryParameter("upperCardBgColor");

  const lowerCardBgColor = useCustomStoreQueryParameter("lowerCardBgColor");

  return (
    <CardContainer
      $isUpperCardBgColorDefined={!!upperCardBgColor}
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
      <DataContainer $isLowerCardBgColorDefined={!!lowerCardBgColor}>
        <div>
          <Typography
            color={colors.black}
            fontSize="1.25rem"
            fontWeight="600"
            margin="0 0 0.625rem 0"
          >
            {name}
          </Typography>
          <StyledGrid alignItems="flex-start" margin="0 0 0.3125rem 0">
            <Typography
              fontSize="12px"
              fontWeight="400"
              color={colors.darkGrey}
            >
              Products
            </Typography>
          </StyledGrid>
          <StyledGrid alignItems="flex-start">
            <Typography fontSize="20px" fontWeight="600" color={colors.black}>
              {numProducts}
            </Typography>
          </StyledGrid>
        </div>
      </DataContainer>
    </CardContainer>
  );
}
