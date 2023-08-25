import { exchanges, subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { ArrowSquareOut } from "phosphor-react";
import { useMemo } from "react";

import { getExchangeTokenId } from "../../lib/utils/exchange";
import { Exchange } from "../../lib/utils/hooks/useExchanges";
import { OpenSeaButton } from "./Detail.style";

interface Props {
  exchange?: Exchange;
}

const openSeaUrlMap = new Map([
  [
    "testing", // Mumbai
    (tokenId: string, contractAddress: string) =>
      `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`
  ],
  [
    "staging", // Mumbai
    (tokenId: string, contractAddress: string) =>
      `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`
  ],
  [
    "production", // Polygon
    (tokenId: string, contractAddress: string) =>
      `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`
  ]
]);

export default function DetailOpenSea({ exchange }: Props) {
  const { config } = useConfigContext();
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

    const urlFn = openSeaUrlMap.get(config.envName);

    const tokenId = getExchangeTokenId(exchange, config.envName);

    return urlFn?.(tokenId, exchange.seller.voucherCloneAddress) || "";
  }, [exchange, config.envName]);

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
