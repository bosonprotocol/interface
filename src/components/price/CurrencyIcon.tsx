import styled from "styled-components";

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
}

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  transform: scale(1.5);
  margin-right: 2px;
  path {
    fill: var(--accent);
  }
`;

export default function CurrencyIcon({ currencySymbol }: Props) {
  const symbolUpperCase =
    currencySymbol.toUpperCase() as keyof typeof currencyImages;

  if (!currencyImages[symbolUpperCase]) {
    return null;
  }
  const Icon = currencyImages[symbolUpperCase];
  return (
    <IconContainer>
      <Icon />
    </IconContainer>
  );
}
