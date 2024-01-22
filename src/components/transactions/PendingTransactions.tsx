import { useMemo } from "react";

import { usePendingTransactionsStore } from "../../lib/utils/hooks/transactions/usePendingTransactions";
import { buildTableData } from "../../lib/utils/transactions";
import { Grid } from "../ui/Grid";
import Loading from "../ui/Loading";
import TransactionsTable from "./TransactionsTable";

export const PendingTransactions = () => {
  const { transactions, isLoading, didInitiallyReconcile } =
    usePendingTransactionsStore();

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
