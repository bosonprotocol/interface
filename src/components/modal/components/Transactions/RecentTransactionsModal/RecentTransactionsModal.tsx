import { useState } from "react";

import { useCompletedTransactions } from "../../../../../lib/utils/hooks/transactions/useCompletedTransactions";
import { usePendingTransactionsStore } from "../../../../../lib/utils/hooks/transactions/usePendingTransactions";
import { CompletedTransactions } from "../../../../transactions/CompleteTransactions";
import { PendingTransactions } from "../../../../transactions/PendingTransactions";
import Grid from "../../../../ui/Grid";
import Toggle from "./Toggle";

enum TransactionsToogleStates {
  PENDING = "pending",
  COMPLETED = "completed"
}

function RecentTransactionsModal() {
  const [transactionsToogle, setTransactionsToogle] =
    useState<TransactionsToogleStates>(TransactionsToogleStates.PENDING);

  const pendingTransactions = usePendingTransactionsStore();
  const completedTransactions = useCompletedTransactions();

  // useEffect(() => {
  //   completedTransactions.refetch();
  // }, [pendingTransactions.transactions]); // eslint-disable-line

  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1rem">
      <Toggle
        leftButtonText="Pending"
        rightButtonText="Completed"
        onLeftButtonClick={() => {
          setTransactionsToogle(TransactionsToogleStates.PENDING);
        }}
        onRightButtonClick={() => {
          setTransactionsToogle(TransactionsToogleStates.COMPLETED);
        }}
        initiallySelected="left"
      />
      {transactionsToogle === TransactionsToogleStates.PENDING && (
        <PendingTransactions {...pendingTransactions} />
      )}
      {transactionsToogle === TransactionsToogleStates.COMPLETED && (
        <CompletedTransactions {...completedTransactions} />
      )}
    </Grid>
  );
}

export default RecentTransactionsModal;
