import { AuthTokenType, Grid, subgraph } from "@bosonprotocol/react-kit";
import { useMemo, useState } from "react";
import { generatePath } from "react-router-dom";
import styled, { css } from "styled-components";

import { UrlParameters } from "../../../../../lib/routing/parameters";
import { BosonRoutes } from "../../../../../lib/routing/routes";
import { colors } from "../../../../../lib/styles/colors";
import { Profile } from "../../../../../lib/utils/hooks/lens/graphql/generated";
import { useKeepQueryParamsNavigate } from "../../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import useSellerNumbers from "../../../../../lib/utils/hooks/useSellerNumbers";
import { useCustomStoreQueryParameter } from "../../../../../pages/custom-store/useCustomStoreQueryParameter";
import { ExtendedSeller } from "../../../../../pages/explore/WithAllOffers";
import Image from "../../../../ui/Image";
import { Typography } from "../../../../ui/Typography";

const CardContainer = styled.div<{
  $isUpperCardBgColorDefined: boolean;
}>`
  position: relative;
  background: ${colors.greyLight};
  display: flex;
  cursor: pointer;
  flex-direction: column;
  border: 2px solid ${colors.greyLight};
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-width: 16.5625rem;
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
  display: flex;
  padding: 1rem;
  gap: 1rem;
  background: ${colors.greyLight};
  height: 13rem;
  max-height: 13rem;
`;

const LargeImageContainer = styled.div`
  flex: 2;
  height: 6.375rem;
  position: relative;
  max-height: 6.375rem;
  min-height: 6.375rem;
`;

const SmallImagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

const LargeImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  height: 6.375rem;
  max-height: 6.375rem;
  position: relative;
  left: 0;
  height: 6.375rem;
  max-height: 6.375rem;
  img {
    height: 6.375rem;
    max-height: 6.375rem;
    object-fit: contain;
    transform: none;
    left: 0;
    top: 30px;
    box-shadow: 0 0 0 2px ${colors.greyLight};
    width: inherit;
  }
`;

const BaseSmallImage = css`
  width: 100%;
  height: 3.125rem;
  max-height: 3.125rem;
  object-fit: cover;
  border-radius: 4px;
  position: relative;
  padding: 0;
  overflow: visible;
  img {
    height: 3.125rem;
    max-height: 3.125rem;
    object-fit: contain;
    box-shadow: 0 0 0 2px ${colors.greyLight};
    width: 100%;
    left: unset;
    transform: none;
  }
`;

const SmallImageTop = styled(Image)`
  ${BaseSmallImage}
  img {
    top: 1.25rem;
  }
`;

const SmallImageBottom = styled(Image)`
  ${BaseSmallImage}
`;

const DataContainer = styled.div<{
  $isLowerCardBgColorDefined: boolean;
}>`
  padding: 16px;
  background: white;
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

const ProfileImage = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  margin-right: 8px;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

interface Props {
  collection: ExtendedSeller;
  lensProfile?: Profile;
}

const imagesNumber = 3;

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

    if (array.length < imagesNumber) {
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
        <LargeImageContainer>
          {images[0] && (
            <LargeImage
              src={images[0]}
              style={{ height: 102, objectFit: "contain" }}
              withLoading={false}
            />
          )}
        </LargeImageContainer>
        <SmallImagesContainer>
          {images[1] && (
            <SmallImageTop
              src={images[1]}
              withLoading={false}
              style={{ height: 60, objectFit: "contain" }}
            />
          )}
          {images[2] && (
            <SmallImageBottom
              src={images[2]}
              withLoading={false}
              style={{ height: 60, objectFit: "contain" }}
            />
          )}
        </SmallImagesContainer>
      </ImagesContainer>
      <DataContainer $isLowerCardBgColorDefined={!!lowerCardBgColor}>
        <Grid
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          {metadata?.images && metadata.images.length > 0 && (
            <ProfileImage
              src={
                metadata.images.find((image) => image.tag === "profile")?.url
              }
              alt={name}
            />
          )}
          <div>
            <NameContainer>
              <Typography
                color={colors.black}
                fontSize="0.875rem"
                fontWeight="600"
              >
                {name}
              </Typography>
            </NameContainer>
            <Typography
              fontSize="0.75rem"
              fontWeight="400"
              color={colors.greyDark}
            >
              {numProducts} Products
            </Typography>
          </div>
        </Grid>
      </DataContainer>
    </CardContainer>
  );
}
