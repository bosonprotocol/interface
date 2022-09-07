import { Currencies, CurrencyDisplay } from "@bosonprotocol/react-kit";
import { useState } from "react";

import { CONFIG } from "../../lib/config";
import { ReactComponent as bosonIcon } from "./images/boson.svg";
import { ReactComponent as daiIcon } from "./images/dai.svg";
import { ReactComponent as ethIcon } from "./images/eth-icon.svg";

const currencyImages = {
  DAI: daiIcon,
  BOSON: bosonIcon,
  ETH: ethIcon
} as const;

interface Props {
  currencySymbol: string;
  onError?: () => void;
}

const chain = [137, 80001].includes(CONFIG.chainId) ? "polygon" : "ethereum";

export default function CurrencyIcon({ currencySymbol, onError }: Props) {
  const [error, setError] = useState<boolean>(false);
  try {
    const symbolUpperCase =
      currencySymbol.toUpperCase() as keyof typeof currencyImages;

    if (currencyImages[symbolUpperCase]) {
      const Icon = currencyImages[symbolUpperCase];
      return <Icon width="25" height="25" viewBox="0 0 25 25" />;
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
    return <CurrencyDisplay currency={usedCurrency} height={20} />;
  } catch (error) {
    setError(true);
    onError?.();
    return null;
  }
}
