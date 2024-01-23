import { useMemo } from "react";

import { useCompletedTransactions } from "../../lib/utils/hooks/transactions/useCompletedTransactions";
import { buildTableData } from "../../lib/utils/transactions";
import { Grid } from "../ui/Grid";
import Loading from "../ui/Loading";
import TransactionsTable from "./TransactionsTable";

export const CompletedTransactions = () => {
  // TODO: implement infinite scroll for table
  const { data, isLoading } = useCompletedTransactions();

  const tableData = useMemo(() => buildTableData(data || []), [data]);

  if (isLoading) {
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
