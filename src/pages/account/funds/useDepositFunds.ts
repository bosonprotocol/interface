import { BigNumberish } from "ethers";
import { useCallback } from "react";

import { useCoreSDK } from "../../../lib/utils/useCoreSdk";

interface Props {
  accountId: string;
  tokenAddress: string;
  amount: BigNumberish;
}

export default function useDepositFunds({
  accountId,
  tokenAddress,
  amount
}: Props) {
  const coreSdk = useCoreSDK();

  return useCallback(() => {
    return coreSdk?.depositFunds(accountId, amount, tokenAddress);
  }, [coreSdk, accountId, amount, tokenAddress]);
}
