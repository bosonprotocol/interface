import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "ethers";
import { Offer } from "lib/types/offer";
import styled from "styled-components";

import OfferItem from "../offer/Offer";

const OfferContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 285px));
  grid-row-gap: 20px;
  grid-column-gap: 10px;
  justify-content: space-between;
  padding-bottom: 24px;
`;

const shortenAddress = (address: string): string => {
  if (!address) {
    return address;
  }
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 4
  )}`;
};

interface Props {
  offers?: Array<Offer>;
}

export default function OfferList({ offers }: Props) {
  if (!offers || offers.length === 0) {
    return (
      <OfferContainer data-testid="noOffers">
        There are no offers at the moment
      </OfferContainer>
    );
  }

  return (
    <OfferContainer>
      {offers.map((offer: Offer, idx: number) => (
        <OfferItem
          key={offer.id}
          id={offer.id}
          offerImg={`https://picsum.photos/22${idx}`}
          name={offer.metadata?.name || "Untitled"}
          sellerFullAdress={offer.seller?.address}
          sellerShortAddress={shortenAddress(offer.seller?.address)}
          price={formatUnits(
            BigNumber.from(offer.price),
            offer.exchangeToken?.decimals
          )}
          priceSymbol={offer.exchangeToken?.symbol}
          isSold={false}
        />
      ))}
    </OfferContainer>
  );
}
