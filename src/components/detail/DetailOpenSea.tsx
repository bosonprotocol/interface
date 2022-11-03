import { exchanges, subgraph } from "@bosonprotocol/react-kit";
import { ArrowSquareOut } from "phosphor-react";
import { useMemo } from "react";

import { CONFIG } from "../../lib/config";
import { Exchange } from "../../lib/utils/hooks/useExchanges";
import { OpenSeaButton } from "./Detail.style";

interface Props {
  exchange?: Exchange;
}

const openSeaUrlMap = new Map([
  [
    "testing", // Mumbai
    (exchangeId: string, contractAddress: string) =>
      `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${exchangeId}`
  ],
  [
    "staging", // Mumbai
    (exchangeId: string, contractAddress: string) =>
      `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${exchangeId}`
  ],
  [
    "production", // Polygon
    (exchangeId: string, contractAddress: string) =>
      `https://opensea.io/assets/matic/${contractAddress}/${exchangeId}`
  ]
]);

export default function DetailOpenSea({ exchange }: Props) {
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(
        exchange as unknown as subgraph.ExchangeFieldsFragment
      )
    : null;
  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.Committed;

  const openSeaUrl = useMemo(() => {
    if (!exchange) {
      return "";
    }

    const urlFn = openSeaUrlMap.get(CONFIG.envName);

    return urlFn?.(exchange.id, exchange.seller.voucherCloneAddress) || "";
  }, [exchange]);

  if (!isToRedeem) {
    return null;
  }

  return (
    <OpenSeaButton href={openSeaUrl} $disabled={!openSeaUrl} target="_blank">
      View on OpenSea
      <ArrowSquareOut size={18} />
    </OpenSeaButton>
  );
}
