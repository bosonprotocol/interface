import { useEffect, useMemo } from "react";

import { usePendingTransactionsStore } from "../../lib/utils/hooks/transactions/usePendingTransactions";
import { buildTableData } from "../../lib/utils/transactions";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import Grid from "../ui/Grid";
import Loading from "../ui/Loading";
import TransactionsTable from "./TransactionsTable";

export const PendingTransactions = () => {
  const coreSDK = useCoreSDK();
  const {
    transactions,
    reconcilePendingTransactions,
    isLoading,
    didInitiallyReconcile,
    resetInitialReconcile
  } = usePendingTransactionsStore();

  useEffect(() => {
    resetInitialReconcile();
    reconcilePendingTransactions(coreSDK);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (didInitiallyReconcile) {
      const intervalId = setInterval(() => {
        reconcilePendingTransactions(coreSDK);
      }, 5_000);
      return () => clearInterval(intervalId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didInitiallyReconcile]);

  const tableData = useMemo(() => buildTableData(transactions), [transactions]);

  if (isLoading && !didInitiallyReconcile) {
    return <Loading />;
  }

  return (
    <Grid
      flexDirection="column"
      alignItems="flex-start"
      gap="0.75rem"
      margin="0 0 2rem 0"
    >
      <TransactionsTable transactions={tableData} />
    </Grid>
  );
};
