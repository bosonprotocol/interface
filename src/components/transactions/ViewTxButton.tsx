import { useEffect } from "react";

import { usePendingTransactionsStore } from "../../lib/utils/hooks/transactions/usePendingTransactions";
import { useCoreSDK } from "../../lib/utils/useCoreSdk";
import { Spinner } from "../loading/Spinner";
import { useModal } from "../modal/useModal";
import BosonButton from "../ui/BosonButton";
import Grid from "../ui/Grid";

export default function ViewTxButton() {
  const { showModal } = useModal();
  const coreSDK = useCoreSDK();
  const { transactions, reconcilePendingTransactions, resetInitialReconcile } =
    usePendingTransactionsStore();

  useEffect(() => {
    resetInitialReconcile();
    reconcilePendingTransactions(coreSDK);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (didInitiallyReconcile) {
  //     const intervalId = setInterval(() => {
  //       reconcilePendingTransactions(coreSDK);
  //     }, 5_000);
  //     return () => clearInterval(intervalId);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [didInitiallyReconcile]);

  const numPendingTx = transactions.length;

  return (
    <>
      <BosonButton
        variant="accentInverted"
        onClick={(e) => {
          e.stopPropagation();
          showModal(
            "RECENT_TRANSACTIONS",
            {
              title: "Recent Transactions"
            },
            "m"
          );
        }}
      >
        <Grid
          $width="initial"
          gap="0.5rem"
          alignItems="center"
          flexWrap="nowrap"
        >
          {numPendingTx ? (
            <>
              <span>{numPendingTx}</span> Pending <Spinner size={15} />
            </>
          ) : (
            <>Transactions</>
          )}
        </Grid>
      </BosonButton>
    </>
  );
}
