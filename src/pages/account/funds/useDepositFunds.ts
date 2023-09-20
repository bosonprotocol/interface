import { TransactionResponse } from "@bosonprotocol/common";
import { CoreSDK } from "@bosonprotocol/react-kit";
import { BigNumberish, ethers } from "ethers";
import { useAccount } from "lib/utils/hooks/connection/connection";
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
  const { account: address } = useAccount();

  return useCallback(() => {
    let depositFundsResponse: Promise<TransactionResponse>;
    const isMetaTx = Boolean(
      coreSdk?.isMetaTxConfigSet &&
        address &&
        tokenAddress !== ethers.constants.AddressZero
    );
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
