import { Spinner } from "../loading/Spinner";
import { useModal } from "../modal/useModal";
import BosonButton from "../ui/BosonButton";
import Grid from "../ui/Grid";

export default function ViewTxButton() {
  const { showModal } = useModal();
  const numPendingTx = 0; // TODO: get actual number of pending local/meta transactions
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
          {numPendingTx > 0 ? numPendingTx : null}
          <div>{numPendingTx ? `Pending` : `Transactions`}</div>
          {!!numPendingTx && <Spinner size={15} />}
        </Grid>
      </BosonButton>
    </>
  );
}
