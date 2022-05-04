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

interface Props {
  offers?: Array<Offer>;
  isError: boolean;
  isLoading: boolean;
}

export default function OfferList({ offers, isLoading, isError }: Props) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div data-testid="errorOffers">
        There has been an error, please try again later...
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <OfferContainer data-testid="noOffers">No offers found</OfferContainer>
    );
  }

  return (
    <OfferContainer>
      {offers.map((offer: Offer, idx: number) => {
        // TODO: remove this @ts-ignore once the Offer is of productv1 type and therefore has an array of images
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const images = offer.metadata?.images;
        const offerImg = images?.length
          ? images?.[0]
          : `https://picsum.photos/22${idx}`;
        return (
          <OfferItem
            key={offer.id}
            id={offer.id}
            offerImg={offerImg}
            name={offer.metadata?.name || "Untitled"}
            sellerAddress={offer.seller?.admin}
            price={formatUnits(
              BigNumber.from(offer.price),
              offer.exchangeToken?.decimals
            )}
            priceSymbol={offer.exchangeToken?.symbol}
            isSold={false}
          />
        );
      })}
    </OfferContainer>
  );
}
