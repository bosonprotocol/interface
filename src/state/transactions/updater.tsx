import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { DEFAULT_TXN_DISMISS_MS, L2_TXN_DISMISS_MS } from "lib/constants/misc";
import LibUpdater from "lib/hooks/transactions/updater"; // TODO:
import { useChainId } from "lib/utils/hooks/connection/connection";
import { useCallback, useMemo } from "react";
import { PopupType } from "state/application/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";

import { useAddPopup } from "../application/hooks";
import { isPendingTx } from "./hooks";
import { checkedTransaction, finalizeTransaction } from "./reducer";
import { SerializableTransactionReceipt, TransactionDetails } from "./types";

export function toSerializableReceipt(
  receipt: TransactionReceipt
): SerializableTransactionReceipt {
  return {
    blockHash: receipt.blockHash,
    blockNumber: receipt.blockNumber,
    contractAddress: receipt.contractAddress,
    from: receipt.from,
    status: receipt.status,
    to: receipt.to,
    transactionHash: receipt.transactionHash,
    transactionIndex: receipt.transactionIndex
  };
}

export default function Updater() {
  const chainId = useChainId();
  const addPopup = useAddPopup();
  // speed up popup dismisall time if on L2
  const isL2 = false;
  const transactions = useAppSelector((state) => state.transactions);
  const pendingTransactions = useMemo(() => {
    if (!chainId || !transactions[chainId]) return {};
    return Object.values(transactions[chainId]).reduce((acc, tx) => {
      if (isPendingTx(tx)) acc[tx.hash] = tx;
      return acc;
    }, {} as Record<string, TransactionDetails>);
  }, [chainId, transactions]);

  const dispatch = useAppDispatch();
  const onCheck = useCallback(
    ({
      chainId,
      hash,
      blockNumber
    }: {
      chainId: number;
      hash: string;
      blockNumber: number;
    }) => dispatch(checkedTransaction({ chainId, hash, blockNumber })),
    [dispatch]
  );
  const onReceipt = useCallback(
    ({
      chainId,
      hash,
      receipt
    }: {
      chainId: number;
      hash: string;
      receipt: TransactionReceipt;
    }) => {
      dispatch(
        finalizeTransaction({
          chainId,
          hash,
          receipt: toSerializableReceipt(receipt)
        })
      );

      addPopup(
        {
          type: PopupType.Transaction,
          hash
        },
        hash,
        isL2 ? L2_TXN_DISMISS_MS : DEFAULT_TXN_DISMISS_MS
      );
    },
    [addPopup, dispatch, isL2]
  );

  return (
    <LibUpdater
      pendingTransactions={pendingTransactions}
      onCheck={onCheck}
      onReceipt={onReceipt}
    />
  );
}
