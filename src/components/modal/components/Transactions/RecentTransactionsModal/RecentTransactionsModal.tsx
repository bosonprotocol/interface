import { useState } from "react";

import { CompletedTransactions } from "../../../../transactions/CompleteTransactions";
import { PendingTransactions } from "../../../../transactions/PendingTransactions";
import { Grid } from "../../../../ui/Grid";
import Toggle from "./Toggle";

enum TransactionsToogleStates {
  PENDING = "pending",
  COMPLETED = "completed"
}

function RecentTransactionsModal() {
  const [transactionsToogle, setTransactionsToogle] =
    useState<TransactionsToogleStates>(TransactionsToogleStates.PENDING);

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
        <PendingTransactions />
      )}
      {transactionsToogle === TransactionsToogleStates.COMPLETED && (
        <CompletedTransactions />
      )}
    </Grid>
  );
}

export default RecentTransactionsModal;
