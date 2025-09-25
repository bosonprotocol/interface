import { Currencies, CurrencyLogo } from "@bosonprotocol/react-kit";
import * as Sentry from "@sentry/browser";
import { useConfigContext } from "components/config/ConfigContext";
import { useState } from "react";

import bosonIcon from "./images/boson.svg?react";
import daiIcon from "./images/dai.svg?react";

const currencyImages = {
  DAI: daiIcon,
  BOSON: bosonIcon
} as const;

interface Props {
  currencySymbol: string;
  onError?: () => void;
  size?: number;
}

export default function CurrencyIcon({
  currencySymbol,
  onError,
  size = 20
}: Props) {
  const { config } = useConfigContext();
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

    switch (config.envConfig.chainId) {
      case 137:
      case 80002:
        usedCurrency = Currencies.POLYGON;
        break;
      default:
        usedCurrency = Currencies.ETH;
    }
    return <CurrencyLogo currency={usedCurrency} />;
  } catch (error) {
    setError(true);
    Sentry.captureException(error);
    onError?.();
    return null;
  }
}
