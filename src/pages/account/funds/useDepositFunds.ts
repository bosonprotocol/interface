import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK } from "@bosonprotocol/react-kit";
import { BigNumberish } from "ethers";
import { useCallback } from "react";
import { useAccount } from "wagmi";

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
  const { address } = useAccount();

  return useCallback(() => {
    let depositFundsResponse: Promise<TransactionResponse>;
    const isMetaTx = Boolean(coreSdk?.isMetaTxConfigSet && address);
    if (isMetaTx) {
      // call depositFunds with meta-transaction
      depositFundsResponse = depositFundWithMetaTx(
        coreSdk,
        accountId,
        amount,
        tokenAddress
      );
    } else {
      depositFundsResponse = coreSdk?.depositFunds(
        accountId,
        amount,
        tokenAddress
      );
    }
    return depositFundsResponse;
  }, [coreSdk, address, accountId, amount, tokenAddress]);
}

async function depositFundWithMetaTx(
  coreSdk: CoreSDK,
  sellerId: BigNumberish,
  fundsAmount: BigNumberish,
  fundsTokenAddress: string
): Promise<TransactionResponse> {
  const nonce = Date.now();
  const { r, s, v, functionName, functionSignature } =
    await coreSdk.signMetaTxDepositFunds({
      sellerId,
      fundsTokenAddress,
      fundsAmount,
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
