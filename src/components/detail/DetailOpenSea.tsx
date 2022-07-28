import { exchanges, subgraph } from "@bosonprotocol/react-kit";
import { ArrowSquareOut } from "phosphor-react";

import { Offer } from "../../lib/types/offer";
import { OpenSeaButton } from "./Detail.style";

interface Props {
  exchange?: NonNullable<Offer["exchanges"]>[number];
}

export default function DetailOpenSea({ exchange }: Props) {
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(exchange as subgraph.ExchangeFieldsFragment)
    : null;
  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;

  if (!isToRedeem) {
    return null;
  }

  return (
    <OpenSeaButton>
      View on OpenSea
      <ArrowSquareOut size={18} />
    </OpenSeaButton>
  );
}
