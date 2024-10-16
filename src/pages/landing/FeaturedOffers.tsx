import { buttonText } from "components/ui/styles";
import { Profile } from "lib/utils/hooks/lens/graphql/generated";
import { ExtendedOffer } from "pages/explore/WithAllOffers";
import React from "react";
import styled from "styled-components";

import { LinkWithQuery } from "../../components/customNavigation/LinkWithQuery";
import OfferList from "../../components/offers/OfferList";
import { Grid } from "../../components/ui/Grid";
import { Typography } from "../../components/ui/Typography";
import { BosonRoutes } from "../../lib/routing/routes";

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  margin-bottom: 2rem;
  &:last-of-type {
    margin-bottom: 0rem;
  }
`;

const Title = styled(Typography)`
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
`;

export const ViewMore = styled(LinkWithQuery)`
  all: unset;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  margin-left: 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.0625rem;
  ${() => buttonText};
  color: var(--accent);

  transition: all 150ms ease-in-out;
  > svg {
    transition: all 150ms ease-in-out;
    transform: translateX(0);
  }
  &:hover {
    color: color-mix(in srgb, var(--accent) 50%, black);
    > svg {
      transform: translateX(5px);
    }
  }
`;

interface IFeaturedOffers {
  title?: string;
  offers: ExtendedOffer[];
  isLoading: boolean;
  isError: boolean;
  numOffers: number;
  sellerLensProfilePerSellerId?: Map<string, Profile>;
}

const FeaturedOffers: React.FC<IFeaturedOffers> = ({
  title = "Explore Offers",
  offers,
  isLoading,
  isError,
  numOffers,
  sellerLensProfilePerSellerId
}) => {
  return (
    <Root data-testid={"featureOffers"}>
      <Grid
        justifyContent="flex-start"
        alignItems="flex-end"
        margin="1rem 0 2rem 0"
      >
        <Title tag="h3" style={{ margin: "0" }}>
          {title}
        </Title>
        <ViewMore to={BosonRoutes.Explore}>View all</ViewMore>
      </Grid>
      <OfferList
        offers={offers?.slice(0, numOffers)}
        isError={isError}
        isLoading={isLoading}
        numOffers={numOffers}
        action="commit"
        showInvalidOffers={false}
        itemsPerRow={{
          xs: 1,
          s: 2,
          m: 3,
          l: 5,
          xl: 5
        }}
        sellerLensProfilePerSellerId={sellerLensProfilePerSellerId}
      />
    </Root>
  );
};

export default FeaturedOffers;
