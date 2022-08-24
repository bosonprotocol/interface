import { exchanges, subgraph } from "@bosonprotocol/react-kit";
import { ArrowSquareOut } from "phosphor-react";

import { Exchange } from "../../lib/utils/hooks/useExchanges";
import { OpenSeaButton } from "./Detail.style";

interface Props {
  exchange?: Exchange;
}

export default function DetailOpenSea({ exchange }: Props) {
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(
        exchange as unknown as subgraph.ExchangeFieldsFragment
      )
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
