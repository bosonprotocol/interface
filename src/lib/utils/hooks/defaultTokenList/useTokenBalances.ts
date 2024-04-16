import { useConfigContext } from "components/config/ConfigContext";
import { ethers } from "ethers";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import { useQuery } from "react-query";

import { useProvider } from "../connection/connection";
type UseTokensBalancesProps = {
  address: string | undefined | null;
  chainId: number | undefined | null;
  tokens?: SDKToken[] | undefined | null;
};
// TODO: Token should be exported by core-sdk / react-kit
type SDKToken = {
  symbol: string;
  name: string;
  address: string;
  decimals: string;
};

export const useTokenBalances = ({
  address,
  chainId,
  tokens
}: UseTokensBalancesProps) => {
  const {
    config: {
      envConfig: { defaultTokens }
    }
  } = useConfigContext();
  const coreSDK = useCoreSDK();
  const provider = useProvider();
  return useQuery(
    ["use-token-balances", address, chainId, tokens, defaultTokens],
    async () => {
      tokens = tokens || defaultTokens;
      if (!address || !chainId || !tokens?.length) {
        return;
      }

      const promises = tokens.map((token) => {
        const isNative = token.address === ethers.constants.AddressZero;
        if (isNative) {
          return provider?.getBalance(address);
        }
        return coreSDK.erc20BalanceOf({
          contractAddress: token.address,
          owner: address
        });
      });
      const balances = await Promise.all(promises);
      const tokenBalance = tokens.map((token, index) => {
        const balance = balances[index]?.toString();
        return {
          ...token,
          balance,
          formattedBalance: ethers.utils
            .formatUnits(balance ?? "0", Number(token.decimals))
            .toString()
        };
      });
      return tokenBalance;
    }
  );
};
