import { exchanges, subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { ArrowSquareOut } from "phosphor-react";
import { useMemo } from "react";

import { getExchangeTokenId } from "../../lib/utils/exchange";
import { OpenSeaButton } from "./Detail.style";

interface Props {
  exchange?: subgraph.ExchangeFieldsFragment;
  className?: string;
}

const openSeaUrlMap = new Map([
  [
    "testing", // testnets
    new Map([
      [
        "testing-80002-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}`
      ],
      [
        "testing-11155111-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`
      ]
    ])
  ],
  [
    "staging", // testnets
    new Map([
      [
        "staging-80002-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/amoy/${contractAddress}/${tokenId}`
      ],
      [
        "staging-11155111-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/sepolia/${contractAddress}/${tokenId}`
      ]
    ])
  ],
  [
    "production", // Polygon
    new Map([
      [
        "production-137-0",
        (tokenId: string, contractAddress: string) =>
          `https://opensea.io/assets/matic/${contractAddress}/${tokenId}`
      ],
      [
        "production-1-0",
        (tokenId: string, contractAddress: string) =>
          `https://opensea.io/assets/ethereum/${contractAddress}/${tokenId}`
      ]
    ])
  ]
]);

export default function DetailOpenSea({ exchange, className }: Props) {
  const { config } = useConfigContext();
  const exchangeStatus = exchange
    ? exchanges.getExchangeState(
        exchange as unknown as subgraph.ExchangeFieldsFragment
      )
    : null;
  const isToRedeem =
    !exchangeStatus || exchangeStatus === subgraph.ExchangeState.COMMITTED;

  const openSeaUrl = useMemo(() => {
    if (!exchange) {
      return "";
    }

    const urlFn = openSeaUrlMap
      .get(config.envName)
      ?.get(config.envConfig.configId);

    const tokenId = getExchangeTokenId(exchange, config.envName);

    return urlFn?.(tokenId, exchange.seller.voucherCloneAddress) || "";
  }, [exchange, config.envName, config.envConfig.configId]);

  if (!isToRedeem) {
    return null;
  }

  return (
    <OpenSeaButton
      href={openSeaUrl}
      $disabled={!openSeaUrl}
      target="_blank"
      className={className}
    >
      View on OpenSea
      <ArrowSquareOut size={18} />
    </OpenSeaButton>
  );
}
