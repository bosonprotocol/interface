import { useConfigContext } from "components/config/ConfigContext";
import { ethers } from "ethers";
import { useCoreSDK } from "lib/utils/useCoreSdk";
import { useQuery } from "react-query";

import { useProvider } from "../connection/connection";
type UseTokensBalancesProps = {
  address: string | undefined | null;
  chainId: number | undefined | null;
};
export const useTokenBalances = ({
  address,
  chainId
}: UseTokensBalancesProps) => {
  const {
    config: {
      envConfig: { defaultTokens }
    }
  } = useConfigContext();
  const coreSDK = useCoreSDK();
  const provider = useProvider();
  return useQuery(
    ["use-token-balances", address, chainId, defaultTokens],
    async () => {
      if (!address || !chainId || !defaultTokens?.length) {
        return;
      }

      const promises = defaultTokens.map((token) => {
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
      const tokenBalance = defaultTokens.map((token, index) => {
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
