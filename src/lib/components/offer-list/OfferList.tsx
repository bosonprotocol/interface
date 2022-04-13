import placeholerSellerAvatar from "lib/placeholder-seller.svg";
import { useOffers } from "lib/utils/hooks/useOffers";
import styled from "styled-components";

import Offer from "../offer/Offer";

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h2`
  font-size: 28px;
`;

const OfferContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 300px);
  grid-row-gap: 20px;
  grid-column-gap: 10px;
`;

const shortenAddress = (address: string): string => {
  if (!address) {
    return address;
  }
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

export default function OfferList() {
  const [offers] = useOffers();
  return (
    <Root>
      <Heading>Featured Offers</Heading>
      <OfferContainer>
        {offers.length
          ? offers.map((offer, idx) => (
              <Offer
                key={offer.id}
                id={offer.id}
                offerImg={`https://picsum.photos/22${idx}`}
                title={offer.metadata?.title}
                sellerImg={placeholerSellerAvatar}
                sellerName={shortenAddress(offer.seller?.address)}
                priceInEth={offer.price}
                priceSymbol={offer.exchangeToken?.symbol}
                isSold={false}
              />
            ))
          : "There are no offers at the moment"}
      </OfferContainer>
    </Root>
  );
}
