import OfferList from "@components/offers/OfferList";
import { Offer } from "@lib/types/offer";
import { useOffers } from "@lib/utils/hooks/useOffers/";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 10px;
`;

interface Props {
  name?: string;
  brand?: string;
  exchangeTokenAddress?: Offer["exchangeToken"]["address"];
}
export default function ExploreOffers({
  brand,
  name,
  exchangeTokenAddress
}: Props) {
  const {
    data: offers,
    isLoading,
    isError
  } = useOffers({
    brand,
    name,
    voided: false,
    valid: true,
    exchangeTokenAddress,
    filterOutWrongMetadata: true
  });

  return (
    <Container>
      <h1>Explore</h1>
      <OfferList offers={offers} isError={isError} isLoading={isLoading} />
    </Container>
  );
}
