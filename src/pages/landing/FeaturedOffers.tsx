import { BsArrowRightShort } from "react-icons/bs";
import styled from "styled-components";

import { LinkWithQuery } from "../../components/linkStoreFields/LinkStoreFields";
import OfferList from "../../components/offers/OfferList";
import { BosonRoutes } from "../../lib/routing/routes";
import { colors } from "../../lib/styles/colors";
import { useOffers } from "../../lib/utils/hooks/offers";

const Root = styled.div`
  display: flex;
  flex-direction: column;
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
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  color: ${colors.secondary};
  transform: translateX(12px);
`;

const Heading = styled.h2`
  font-size: 28px;
`;

export default function FeaturedOffers() {
  const {
    data: offers,
    isLoading,
    isError
  } = useOffers({
    voided: false,
    valid: true,
    first: 3
  });
  return (
    <Root>
      <TopContainer>
        <Heading>Featured Offers</Heading>
        <ViewMore to={BosonRoutes.Explore}>
          <>
            View more
            <BsArrowRightShort size={50} />
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
}
