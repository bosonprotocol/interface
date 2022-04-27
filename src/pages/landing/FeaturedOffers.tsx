import { useOffers } from "lib/utils/hooks/useOffers";
import styled from "styled-components";

import OfferList from "../../components/offers/OfferList";

interface Props {
  name: string;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h2`
  font-size: 28px;
`;

export default function FeaturedOffers({ name }: Props) {
  const { data: offers, isLoading } = useOffers({
    name,
    voided: false,
    valid: true
  });
  return (
    <Root>
      <Heading>Featured Offers</Heading>
      {isLoading ? "Loading..." : <OfferList offers={offers} />}
    </Root>
  );
}
