import { exchanges } from "@bosonprotocol/core-sdk";
import {
  ExchangeFieldsFragment,
  ExchangeState
} from "@bosonprotocol/core-sdk/dist/cjs/subgraph";
import { HiOutlineExternalLink } from "react-icons/hi";

import { Offer } from "../../lib/types/offer";
import { OpenSeaButton } from "./Detail.style";

interface Props {
  exchange?: NonNullable<Offer["exchanges"]>[number];
}

export default function DetailOpenSea({ exchange }: Props) {
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(exchange as ExchangeFieldsFragment)
    : null;
  const isToRedeem =
    !exchangeStatus || exchangeStatus === ExchangeState.Committed;

  if (!isToRedeem) {
    return null;
  }

  return (
    <OpenSeaButton>
      View on OpenSea
      <HiOutlineExternalLink size={18} />
    </OpenSeaButton>
  );
}
