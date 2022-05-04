import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "ethers";
import { Offer } from "lib/types/offer";
import styled from "styled-components";

const Price = styled.span`
  font-size: 16px;
  font-weight: 600;
`;
interface Props {
  offer: Offer;
}
export default ({ offer }: Props) => {
  const price = formatUnits(
    BigNumber.from(offer.price),
    offer.exchangeToken?.decimals
  );
  const priceSymbol = offer.exchangeToken?.symbol;
  return (
    <Price data-testid="price">
      {price} {priceSymbol}
    </Price>
  );
};
