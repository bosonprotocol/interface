import { Fragment, useMemo } from "react";
import { generatePath } from "react-router-dom";
import styled from "styled-components";

import { UrlParameters } from "../../../../../lib/routing/parameters";
import { BosonRoutes } from "../../../../../lib/routing/routes";
import { colors } from "../../../../../lib/styles/colors";
import { useKeepQueryParamsNavigate } from "../../../../../lib/utils/hooks/useKeepQueryParamsNavigate";
import Grid from "../../../../ui/Grid";
import Image from "../../../../ui/Image";
import Typography from "../../../../ui/Typography";

const CardContainer = styled.div`
  position: relative;
  padding-bottom: 7.8125rem;
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
  background-color: ${colors.grey2};
`;
const DataWrapper = styled.div`
  width: max-content;
`;
const DataContainer = styled.div`
  padding: 1rem 1.5rem 1rem 1.5rem;
  background: ${colors.white};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
`;

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
export default function CollectionsCard({ collection }: Props) {
  const navigate = useKeepQueryParamsNavigate();
  const images = useMemo(() => {
    const array = collection && collection.offers;

    if (array.length < 3) {
      for (let index = 0; index < 4; index++) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        array.push({ id: index?.toString() });
      }
    }

    return array;
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
          images?.slice(0, 4).map((offer) => (
            <Fragment key={`CollectionsCardImage_${offer.id}`}>
              <Image src={offer?.metadata?.image} />
            </Fragment>
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
