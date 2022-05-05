import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "ethers";
import { Offer } from "lib/types/offer";

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
