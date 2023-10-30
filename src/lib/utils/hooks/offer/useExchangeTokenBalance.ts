import { subgraph } from "@bosonprotocol/react-kit";
import { Token } from "@uniswap/sdk-core";
import { useConfigContext } from "components/config/ConfigContext";
import { ethers } from "ethers";
import { useMemo } from "react";

import { useAccount, useChainId } from "../connection/connection";
import {
  useNativeCurrencyBalances,
  useTokenBalancesWithLoadingIndicator
} from "../useCurrencyBalance";

export function useExchangeTokenBalance(
  exchangeToken: Pick<
    subgraph.OfferFieldsFragment["exchangeToken"],
    "address" | "decimals"
  >
) {
  const chainId = useChainId();
  const { config } = useConfigContext();
  const chainIdToUse = chainId ?? config.envConfig.chainId;
  const { account: address } = useAccount();

  const isNativeCoin = exchangeToken.address === ethers.constants.AddressZero;
  const tokens = useMemo(() => {
    return [
      new Token(
        chainIdToUse,
        exchangeToken.address,
        Number(exchangeToken.decimals)
      )
    ];
  }, [exchangeToken, chainIdToUse]);
  const [tokenCurrencyAmounts, loading] = useTokenBalancesWithLoadingIndicator(
    chainIdToUse,
    address,
    !isNativeCoin && chainIdToUse ? tokens : []
  );
  const nativeBalances = useNativeCurrencyBalances(
    isNativeCoin ? [address] : []
  );

  return {
    balance: Object.values(
      isNativeCoin ? nativeBalances : tokenCurrencyAmounts
    )[0],
    loading
  };
}
