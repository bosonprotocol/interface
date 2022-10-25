import { CoreSDK } from "@bosonprotocol/react-kit";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import create from "zustand";

import { EventLog } from "../../transactions";
import { useCurrentBuyer } from "../useCurrentBuyer";
import { useCurrentSellers } from "../useCurrentSellers";

type PendingTransaction = Omit<EventLog, "__typename"> & {
  accountType: "Buyer" | "Seller";
  isMetaTx?: boolean;
  newHash?: string; // only exists on meta transactions after first reconcile
};

type PendingTransactionsState = {
  transactions: PendingTransaction[];
  didInitiallyReconcile: boolean;
  isLoading: boolean;
  resetInitialReconcile: () => void;
  addPendingTransaction: (pendingTx: PendingTransaction) => void;
  reconcilePendingTransactions: (coreSDK: CoreSDK) => Promise<void>;
};

export function createPendingTx(
  args: Omit<PendingTransaction, "id" | "timestamp" | "account"> & {
    accountId: string;
  }
): PendingTransaction {
  return {
    ...args,
    account: {
      id: args.accountId
    },
    id: Date.now().toString(),
    timestamp: Math.floor(Date.now() / 1000).toString()
  };
}

export function useAddPendingTransaction() {
  const { address } = useAccount();
  const { data: currentBuyer } = useCurrentBuyer();
  const { sellerIds } = useCurrentSellers();
  const { addPendingTransaction } = usePendingTransactionsStore();

  const addPendingTx = useCallback(
    (
      args: Omit<
        Parameters<typeof createPendingTx>[0],
        "executedBy" | "accountId"
      >
    ) => {
      const accountId =
        args.accountType === "Buyer" ? currentBuyer?.id : sellerIds[0];

      if (address && accountId) {
        addPendingTransaction(
          createPendingTx({
            executedBy: address,
            accountId,
            ...args
          })
        );
      }
    },
    [address, addPendingTransaction, currentBuyer?.id, sellerIds]
  );

  return addPendingTx;
}

export const usePendingTransactionsStore = create<PendingTransactionsState>(
  (set, get) => ({
    transactions: [],
    didInitiallyReconcile: false,
    isLoading: false,
    resetInitialReconcile: () =>
      set((state) => ({ ...state, didInitiallyReconcile: false })),
    addPendingTransaction: (pendingTx: PendingTransaction) =>
      set((state) => ({
        ...state,
        transactions: [pendingTx, ...state.transactions]
      })),
    reconcilePendingTransactions: async (coreSDK: CoreSDK) => {
      set((state) => ({
        ...state,
        isLoading: true
      }));

      const pendingTransactions = get().transactions.filter(
        (tx) => !tx.isMetaTx
      );
      const pendingMetaTransactions = get().transactions.filter(
        (tx) => tx.isMetaTx
      );

      const [reconciledPendingTransactions, reconciledPendingMetaTransactions] =
        await Promise.all([
          getReconciledPendingTransactions(coreSDK, pendingTransactions),
          getReconciledPendingMetaTransactions(coreSDK, pendingMetaTransactions)
        ]);

      set((state) => ({
        ...state,
        didInitiallyReconcile: true,
        isLoading: false,
        transactions: [
          ...reconciledPendingTransactions,
          ...reconciledPendingMetaTransactions
        ].sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
      }));
    }
  })
);

async function getReconciledPendingTransactions(
  coreSDK: CoreSDK,
  pendingTransactions: PendingTransaction[]
) {
  try {
    const logs = await coreSDK.getEventLogs({
      logsFilter: {
        hash_in: pendingTransactions.map((tx) => tx.hash)
      }
    });
    const completedTxHashes = new Set(logs.map((log) => log.hash));
    return pendingTransactions.filter((tx) => !completedTxHashes.has(tx.hash));
  } catch (error) {
    console.error(error);
    return pendingTransactions;
  }
}

async function getReconciledPendingMetaTransactions(
  coreSDK: CoreSDK,
  pendingTransactions: PendingTransaction[]
) {
  try {
    const resubmittedMetaTxResults = await Promise.all(
      pendingTransactions.map((metaTx) =>
        coreSDK.getResubmittedMetaTx(metaTx.hash)
      )
    );
    const pendingMetaTxHashes = new Set(
      resubmittedMetaTxResults
        .filter((result) => result.newStatus === "PENDING")
        .map((result) => result.oldHash)
    );
    return pendingTransactions
      .filter((tx) => pendingMetaTxHashes.has(tx.hash))
      .map((tx) => {
        const resubmittedResult = resubmittedMetaTxResults.find(
          (result) => result.oldHash === tx.hash
        );
        if (resubmittedResult) {
          return {
            ...tx,
            newHash: resubmittedResult.newHash
          };
        }
        return tx;
      });
  } catch (error) {
    console.error(error);
    return pendingTransactions;
  }
}
