import { BigNumberish } from "ethers";
import { useCallback } from "react";

import { useCoreSDK } from "../../../lib/utils/useCoreSdk";

interface TokenToWithdraw {
  address: string;
  amount: BigNumberish;
}

interface Props {
  accountId: string;
  tokensToWithdraw: Array<TokenToWithdraw>;
}

export default function useWithdrawFunds({
  accountId,
  tokensToWithdraw
}: Props) {
  const coreSdk = useCoreSDK();

  return useCallback(() => {
    return coreSdk?.withdrawFunds(
      accountId,
      tokensToWithdraw.map((t) => t.address),
      tokensToWithdraw.map((t) => t.amount)
    );
  }, [coreSdk, accountId, tokensToWithdraw]);
}
