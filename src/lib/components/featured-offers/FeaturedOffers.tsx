import { useOffers } from "lib/utils/hooks/useOffers";
import styled from "styled-components";

import OfferList from "./OfferList";

interface Props {
  brand: string;
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h2`
  font-size: 28px;
`;

export default function FeaturedOffers({ brand }: Props) {
  const { data: offers, isLoading } = useOffers({ brand });
  return (
    <Root>
      <Heading>Featured Offers</Heading>
      {isLoading ? "Loading..." : <OfferList offers={offers} />}
    </Root>
  );
}
