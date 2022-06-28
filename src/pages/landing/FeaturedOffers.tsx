import { BsArrowRightShort } from "react-icons/bs";
import styled from "styled-components";

import { LinkWithQuery } from "../../components/linkStoreFields/LinkStoreFields";
import OfferList from "../../components/offers/OfferList";
import { buttonText } from "../../components/ui/styles";
import Typography from "../../components/ui/Typography";
import { BosonRoutes } from "../../lib/routing/routes";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useOffers } from "../../lib/utils/hooks/offers";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 2.5rem;
  ${breakpoint.m} {
    padding: 2rem 5rem;
  }
  ${breakpoint.l} {
    padding: 2rem 10rem;
  }
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ViewMore = styled(LinkWithQuery)`
  all: unset;
  display: flex;
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
  type?: "featured" | "hot" | undefined;
}

const FeaturedOffers: React.FC<IFeaturedOffers> = ({
  title = "Explore Offers",
  type = "featured"
}) => {
  const { isXXS, isXS } = useBreakpoints();

  const {
    data: offers,
    isLoading,
    isError
  } = useOffers({
    voided: false,
    valid: true,
    first: isXXS || isXS ? 4 : 3
  });

  return (
    <Root>
      <TopContainer>
        <Typography tag="h2">{title}</Typography>
        <ViewMore to={BosonRoutes.Explore}>
          <>
            View more
            <BsArrowRightShort size={32} />
          </>
        </ViewMore>
      </TopContainer>
      <OfferList
        offers={offers}
        isError={isError}
        isLoading={isLoading}
        action="commit"
        showInvalidOffers={false}
      />
    </Root>
  );
};

export default FeaturedOffers;
