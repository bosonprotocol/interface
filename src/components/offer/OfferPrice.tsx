import { formatUnits } from "@ethersproject/units";
import { Offer } from "@lib/types/offer";
import { BigNumber } from "ethers";

interface Props {
  offer: Offer;
}
export default ({ offer, ...rest }: Props) => {
  const price = formatUnits(
    BigNumber.from(offer.price),
    offer.exchangeToken?.decimals
  );
  const priceSymbol = offer.exchangeToken?.symbol;
  return (
    <span data-testid="price" {...rest}>
      {price} {priceSymbol}
    </span>
  );
};
