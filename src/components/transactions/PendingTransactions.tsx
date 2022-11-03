import { useMemo } from "react";

import { buildTableData, EventLog } from "../../lib/utils/transactions";
import Grid from "../ui/Grid";
import Loading from "../ui/Loading";
import TransactionsTable from "./TransactionsTable";

interface Props {
  transactions?: Array<EventLog & { accountType: string }>;
  isLoading: boolean;
  didInitiallyReconcile: boolean;
}
export const PendingTransactions = ({
  transactions,
  isLoading,
  didInitiallyReconcile
}: Props) => {
  const tableData = useMemo(
    () => buildTableData(transactions || []),
    [transactions]
  );

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
