import { ReactNode, useEffect } from "react";

import { usePendingTransactionsStore } from "../../lib/utils/hooks/transactions/usePendingTransactions";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import { Spinner } from "../loading/Spinner";
import { useModal } from "../modal/useModal";
import { Grid } from "../ui/Grid";

type ViewTxButtonProps = {
  children?: ReactNode;
  [x: string]: unknown;
};

export default function ViewTxButton({ children, ...rest }: ViewTxButtonProps) {
  const { showModal } = useModal();
  const coreSDK = useCoreSDK();
  const {
    transactions,
    reconcilePendingTransactions,
    didInitiallyReconcile,
    resetInitialReconcile
  } = usePendingTransactionsStore();

  useEffect(() => {
    resetInitialReconcile();
    reconcilePendingTransactions(coreSDK);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (didInitiallyReconcile && transactions.length > 0) {
      const intervalId = setInterval(() => {
        reconcilePendingTransactions(coreSDK);
      }, 5_000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didInitiallyReconcile, transactions]);

  const numPendingTx = transactions.length;

  return (
    <Grid
      width="initial"
      gap="0.5rem"
      alignItems="center"
      flexWrap="nowrap"
      data-anchor
      onClick={() => {
        showModal(
          "RECENT_TRANSACTIONS",
          {
            title: "Recent Transactions"
          },
          "m"
        );
      }}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <>
          {numPendingTx ? (
            <>
              <span>{numPendingTx}</span> Pending <Spinner size={15} />
            </>
          ) : (
            <>My Transactions</>
          )}
        </>
      )}
    </Grid>
  );
}
