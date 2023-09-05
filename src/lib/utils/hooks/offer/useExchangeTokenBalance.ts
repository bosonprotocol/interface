import { subgraph } from "@bosonprotocol/react-kit";
import { Token } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

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
  const { account: address, chainId } = useWeb3React();
  const isNativeCoin = exchangeToken.address === ethers.constants.AddressZero;

  const [tokenCurrencyAmounts] = useTokenBalancesWithLoadingIndicator(
    address,
    !isNativeCoin && chainId
      ? [
          new Token(
            chainId,
            exchangeToken.address,
            Number(exchangeToken.decimals)
          )
        ]
      : []
  );
  const nativeBalances = useNativeCurrencyBalances(
    isNativeCoin ? [address] : []
  );
  return Object.values(isNativeCoin ? nativeBalances : tokenCurrencyAmounts)[0];
}
