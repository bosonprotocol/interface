import React from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../../../../lib/routing/parameters";
import { BosonRoutes } from "../../../../../lib/routing/routes";
import { colors } from "../../../../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Grid from "../../../../ui/Grid";
import Image from "../../../../ui/Image";
import Typography from "../../../../ui/Typography";

interface Props {
  collection: {
    id: string;
    exchanges: [];
    offers: {
      id: string;
      validFromDate: string;
      validUntilDate: string;
      metadata: {
        name: string;
        image: string;
      };
      exchanges: [];
    }[];
  };
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 308px;
  border: 1px solid ${colors.black}20;
  &:hover {
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.05), 4px 4px 4px rgba(0, 0, 0, 0.05),
      8px 8px 8px rgba(0, 0, 0, 0.05), 16px 16px 16px rgba(0, 0, 0, 0.05);

    img[data-testid] {
      transform: translate(-50%, -50%) scale(1.05);
    }
  }
`;

const OfferImage = styled.div`
  width: 153.5px;
  height: 191px;
  padding: 0;
  margin: 0;
  div {
    padding-top: 126.5%;
    img {
      object-fit: cover;
    }
  }
`;

const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  height: 387px;
  background-color: ${colors.grey2};
  padding: 0;
  margin: 0;
  overflow: hidden;
`;

const DataWrapper = styled.div`
  width: max-content;
`;

const DataContainer = styled.div`
  background: ${colors.white};
  padding: 16px 24px 16px 24px;
`;

function CollectionsCard({ collection }: Props) {
  const navigate = useKeepQueryParamsNavigate();

  return (
    <CardContainer
      onClick={() => {
        const pathname = generatePath(BosonRoutes.SellerPage, {
          [UrlParameters.exchangeId]: collection.id
        });
        navigate({
          pathname
        });
      }}
    >
      <ImagesContainer>
        {collection &&
          collection.offers.slice(0, 4).map((offer) => (
            <>
              <OfferImage>
                <Image key={offer.id} src={offer?.metadata?.image} />
              </OfferImage>
            </>
          ))}
      </ImagesContainer>
      <DataContainer>
        <DataWrapper>
          <Typography
            color={colors.black}
            $fontSize="1.25rem"
            fontWeight="600"
            margin="0 0 0.625rem 0"
          >
            Seller ID: {collection.id}
          </Typography>
          <Grid alignItems="flex-start" margin="0 0 0.3125rem 0">
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
          </Grid>
          <Grid alignItems="flex-start">
            <Typography $fontSize="20px" fontWeight="600" color={colors.black}>
              {collection?.offers.length || 0}
            </Typography>
            <Typography
              $fontSize="20px"
              fontWeight="600"
              color={colors.black}
              margin="0 0 0 25px"
            >
              {collection?.exchanges.length || 0}
            </Typography>
          </Grid>
        </DataWrapper>
      </DataContainer>
    </CardContainer>
  );
}

export default CollectionsCard;
