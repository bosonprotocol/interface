import { ethers } from "ethers";
import { useState } from "react";

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
  address?: string;
}

const chain = "polygon";

export default function CurrencyIcon({ currencySymbol, address }: Props) {
  const [error, setError] = useState<boolean>(false);
  const symbolUpperCase =
    currencySymbol.toUpperCase() as keyof typeof currencyImages;

  if (currencyImages[symbolUpperCase]) {
    const Icon = currencyImages[symbolUpperCase];
    return <Icon width="25" height="25" viewBox="0 0 25" />;
  }

  if (error) {
    return <span data-currency>{symbolUpperCase}</span>;
  }

  const url =
    address === ethers.constants.AddressZero
      ? `https://raw.githubusercontent.com/trustwallet/assets/8d1c9e051c8b9999cc58ae7e17bac1541dd483a3/blockchains/${chain}/info/logo.png`
      : `https://raw.githubusercontent.com/trustwallet/assets/8d1c9e051c8b9999cc58ae7e17bac1541dd483a3/blockchains/${chain}/assets/${address}/logo.png`;

  return (
    <img
      src={url}
      onError={() => {
        setError(true);
      }}
    />
  );
}
