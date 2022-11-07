import { CaretRight } from "phosphor-react";
import { useMemo } from "react";
import styled from "styled-components";

import { LinkWithQuery } from "../../components/customNavigation/LinkWithQuery";
import OfferList from "../../components/offers/OfferList";
import { buttonText } from "../../components/ui/styles";
import Typography from "../../components/ui/Typography";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import useProductsByFilteredOffers from "../../lib/utils/hooks/product/useProductsByFilteredOffers";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import extractUniqueRandomProducts from "../../lib/utils/product/extractUniqueRandomProducts";

const Root = styled.div`
  display: flex;
  flex-direction: column;

  margin-bottom: 2rem;
  &:last-of-type {
    margin-bottom: 0rem;
  }
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 2rem 0;
`;

const Title = styled(Typography)`
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
`;

const ViewMore = styled(LinkWithQuery)`
  all: unset;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  ${() => buttonText};
  color: ${colors.secondary};

  transition: all 150ms ease-in-out;
  > svg {
    transition: all 150ms ease-in-out;
    transform: translateX(0);
  }
  &:hover {
    color: ${colors.black};
    > svg {
      transform: translateX(5px);
      fill: ${colors.black};
    }
  }
`;

interface IFeaturedOffers {
  title?: string;
}

const FeaturedOffers: React.FC<IFeaturedOffers> = ({
  title = "Explore Offers"
}) => {
  const { isLteXS } = useBreakpoints();

  const { products, isLoading, isError } = useProductsByFilteredOffers({
    voided: false,
    valid: true,
    first: isLteXS ? 6 : 12,
    quantityAvailable_gte: 1
  });
  const shuffledOffers = useMemo(() => {
    try {
      return extractUniqueRandomProducts({
        products,
        quantity: isLteXS ? 6 : 12
      });
    } catch (error) {
      console.error(error);
      return products;
    }
  }, [products, isLteXS]);
  return (
    <Root data-testid={"featureOffers"}>
      <TopContainer>
        <Title tag="h3" style={{ margin: "0" }}>
          {title}
        </Title>
        <ViewMore to={BosonRoutes.Explore}>
          <>
            View more
            <CaretRight size={24} />
          </>
        </ViewMore>
      </TopContainer>
      <OfferList
        offers={shuffledOffers?.slice(0, isLteXS ? 6 : 12)}
        isError={isError}
        isLoading={isLoading}
        action="commit"
        showInvalidOffers={false}
        itemsPerRow={{
          xs: 1,
          s: 2,
          m: 4,
          l: 4,
          xl: 4
        }}
      />
    </Root>
  );
};

export default FeaturedOffers;
