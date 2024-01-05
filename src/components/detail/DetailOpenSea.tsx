import { exchanges, subgraph } from "@bosonprotocol/react-kit";
import { useConfigContext } from "components/config/ConfigContext";
import { ArrowSquareOut } from "phosphor-react";
import { useMemo } from "react";

import { getExchangeTokenId } from "../../lib/utils/exchange";
import { OpenSeaButton } from "./Detail.style";

interface Props {
  exchange?: subgraph.ExchangeFieldsFragment;
}

const openSeaUrlMap = new Map([
  [
    "testing", // Mumbai
    new Map([
      [
        "testing-80001-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`
      ],
      [
        "testing-5-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`
      ]
    ])
  ],
  [
    "staging", // Mumbai
    new Map([
      [
        "staging-80001-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/mumbai/${contractAddress}/${tokenId}`
      ],
      [
        "staging-5-0",
        (tokenId: string, contractAddress: string) =>
          `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`
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
    <OpenSeaButton href={openSeaUrl} $disabled={!openSeaUrl} target="_blank">
      View on OpenSea
      <ArrowSquareOut size={18} />
    </OpenSeaButton>
  );
}
