import bosonIcon from "./images/boson.svg";
import daiIcon from "./images/dai.svg";
import ethIcon from "./images/eth-icon.svg";

const currencyImages = {
  DAI: daiIcon,
  BOSON: bosonIcon,
  ETH: ethIcon
};

interface Props {
  currencySymbol: string;
}

export default function CurrencyIcon({ currencySymbol }: Props) {
  const symbolUpperCase =
    currencySymbol.toUpperCase() as keyof typeof currencyImages;

  if (!currencyImages[symbolUpperCase]) {
    return null;
  }
  return <img src={currencyImages[symbolUpperCase]} alt="currency icon" />;
}
