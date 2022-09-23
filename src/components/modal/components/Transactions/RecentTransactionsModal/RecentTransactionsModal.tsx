import { CheckSquareOffset } from "phosphor-react";
import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../../lib/styles/colors";
import { Spinner } from "../../../../loading/Spinner";
import Button from "../../../../ui/Button";
import Grid from "../../../../ui/Grid";
import { ModalProps } from "../../../ModalContext";
import Toggle from "./Toggle";

const PendingGrid = styled(Grid)`
  color: ${colors.orange};
`;

const CompletedGrid = styled(Grid)`
  color: ${colors.green};
`;

interface Props {
  hideModal: NonNullable<ModalProps["hideModal"]>;
}

// TODO: get actual pending and complete local/meta transactions
const pendingTx = [
  {
    text: "Commit to X",
    status: "Pending"
  }
];
const completedTx = [
  {
    text: "Completed to X",
    status: "Completed"
  }
];

function RecentTransactionsModal({ hideModal }: Props) {
  const [transactions, setTransactions] = useState(pendingTx);
  return (
    <Grid flexDirection="column" alignItems="flex-start" gap="1rem">
      <Toggle
        leftButtonText="Pending"
        rightButtonText="Completed"
        onLeftButtonClick={() => {
          setTransactions(pendingTx);
        }}
        onRightButtonClick={() => {
          setTransactions(completedTx);
        }}
        initiallySelected="left"
      />
      <Grid
        flexDirection="column"
        alignItems="flex-start"
        gap="0.75rem"
        margin="0 0 2rem 0"
      >
        {transactions.map((tx) => {
          return (
            <Grid key={tx.text}>
              <Grid>
                <strong>{tx.text}</strong>
              </Grid>
              <a>
                {tx.status === "Pending" ? (
                  <PendingGrid justifyContent="flex-end" gap="0.5rem">
                    <span>Pending</span>
                    <Spinner size={20} />
                  </PendingGrid>
                ) : (
                  <CompletedGrid gap="0.5rem">
                    {tx.status} <CheckSquareOffset size={20} />
                  </CompletedGrid>
                )}
              </a>
            </Grid>
          );
        })}
      </Grid>
      <Button onClick={hideModal}>Close</Button>
    </Grid>
  );
}

export default RecentTransactionsModal;
