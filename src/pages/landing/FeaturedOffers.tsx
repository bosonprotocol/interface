import OfferList from "@components/offers/OfferList";
import { useOffers } from "@lib/utils/hooks/useOffers";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex-direction: column;
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
    filterOutWrongMetadata: true,
    first: 10
  });
  return (
    <Root>
      <Heading>Featured Offers</Heading>
      <OfferList offers={offers} isError={isError} isLoading={isLoading} />
    </Root>
  );
}
