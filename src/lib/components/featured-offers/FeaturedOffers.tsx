import { useOffers } from "lib/utils/hooks/useOffers";
import styled from "styled-components";

import OfferList from "./OfferList";

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h2`
  font-size: 28px;
`;

export default function FeaturedOffers() {
  const { offers, loading } = useOffers();
  return (
    <Root>
      <Heading>Featured Offers</Heading>
      {loading ? "Loading..." : <OfferList offers={offers} />}
    </Root>
  );
}
