import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK } from "@bosonprotocol/react-kit";
import { BigNumber, BigNumberish } from "ethers";
import { useCallback } from "react";
import { useAccount } from "wagmi";

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
  const { address } = useAccount();

  return useCallback(() => {
    let withdrawFundsResponse: Promise<TransactionResponse>;
    const tokenList = tokensToWithdraw.map((t) => t.address);
    const tokenAmounts = tokensToWithdraw.map((t) =>
      BigNumber.from(t.amount).toString()
    );
    const isMetaTx = Boolean(coreSdk?.isMetaTxConfigSet && address);
    if (isMetaTx) {
      withdrawFundsResponse = withdrawFundWithMetaTx(
        coreSdk,
        accountId,
        tokenList,
        tokenAmounts
      );
    } else {
      withdrawFundsResponse = coreSdk?.withdrawFunds(
        accountId,
        tokenList,
        tokenAmounts
      );
    }
    return withdrawFundsResponse;
  }, [coreSdk, address, accountId, tokensToWithdraw]);
}

async function withdrawFundWithMetaTx(
  coreSdk: CoreSDK,
  accountId: BigNumberish,
  tokenList: string[],
  tokenAmounts: BigNumberish[]
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxWithdrawFunds({
      entityId: accountId,
      tokenList,
      tokenAmounts,
      nonce
    });
  return coreSdk.relayMetaTransaction({
    functionName,
    functionSignature,
    sigR: r,
    sigS: s,
    sigV: v,
    nonce
  });
}
