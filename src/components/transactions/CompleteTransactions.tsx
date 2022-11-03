import { useMemo } from "react";

import { buildTableData, EventLog } from "../../lib/utils/transactions";
import Grid from "../ui/Grid";
import Loading from "../ui/Loading";
import TransactionsTable from "./TransactionsTable";

interface Props {
  data?: Array<EventLog & { accountType: string }>;
  isLoading: boolean;
}
export const CompletedTransactions = ({ data, isLoading }: Props) => {
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
