import { subgraph } from "@bosonprotocol/react-kit";
import { Token } from "@uniswap/sdk-core";
import { useConfigContext } from "components/config/ConfigContext";
import { ethers } from "ethers";

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
  const [tokenCurrencyAmounts, loading] = useTokenBalancesWithLoadingIndicator(
    chainIdToUse,
    address,
    !isNativeCoin && chainIdToUse
      ? [
          new Token(
            chainIdToUse,
            exchangeToken.address,
            Number(exchangeToken.decimals)
          )
        ]
      : []
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
