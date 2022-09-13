import { Currencies, CurrencyLogo } from "@bosonprotocol/react-kit";
import { useState } from "react";

import { CONFIG } from "../../lib/config";
import { ReactComponent as bosonIcon } from "./images/boson.svg";
import { ReactComponent as daiIcon } from "./images/dai.svg";

const currencyImages = {
  DAI: daiIcon,
  BOSON: bosonIcon
} as const;

interface Props {
  currencySymbol: string;
  onError?: () => void;
  size?: number;
}

const chain = [137, 80001].includes(CONFIG.chainId) ? "polygon" : "ethereum";
export default function CurrencyIcon({
  currencySymbol,
  onError,
  size = 20
}: Props) {
  const [error, setError] = useState<boolean>(false);
  try {
    const symbolUpperCase =
      currencySymbol.toUpperCase() as keyof typeof currencyImages;

    if (currencyImages[symbolUpperCase]) {
      const Icon = currencyImages[symbolUpperCase];
      return (
        <Icon width={size} height={size} viewBox={`0 0 ${size} ${size}`} />
      );
    }

    if (error) {
      return <span data-currency>{symbolUpperCase}</span>;
    }

    let usedCurrency: Currencies;

    switch (chain) {
      case "polygon":
        usedCurrency = Currencies.POLYGON;
        break;
      case "ethereum":
        usedCurrency = Currencies.ETH;
        break;
      default:
        usedCurrency = Currencies.ETH;
    }
    return <CurrencyLogo currency={usedCurrency} />;
  } catch (error) {
    setError(true);
    onError?.();
    return null;
  }
}
