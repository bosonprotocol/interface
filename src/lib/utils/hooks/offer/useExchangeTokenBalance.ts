import { subgraph } from "@bosonprotocol/react-kit";
import { Token } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { useAccount } from "../connection/connection";
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
  const { chainId } = useWeb3React();
  const { account: address } = useAccount();

  const isNativeCoin = exchangeToken.address === ethers.constants.AddressZero;

  const [tokenCurrencyAmounts, loading] = useTokenBalancesWithLoadingIndicator(
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
  return {
    balance: Object.values(
      isNativeCoin ? nativeBalances : tokenCurrencyAmounts
    )[0],
    loading
  };
}
