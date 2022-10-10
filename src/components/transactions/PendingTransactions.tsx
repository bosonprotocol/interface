import { Spinner } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";

const PendingGrid = styled(Grid)`
  color: ${colors.orange};
`;

const pendingTx = [
  {
    text: "Commit to X",
    status: "Pending"
  }
];

export const PendingTransactions = () => {
  return (
    <Grid
      flexDirection="column"
      alignItems="flex-start"
      gap="0.75rem"
      margin="0 0 2rem 0"
    >
      {pendingTx.map((tx) => {
        return (
          <Grid key={tx.text}>
            <Grid>
              <strong>{tx.text}</strong>
            </Grid>
            <a>
              <PendingGrid justifyContent="flex-end" gap="0.5rem">
                <span>Pending</span>
                <Spinner size={20} />
              </PendingGrid>
            </a>
          </Grid>
        );
      })}
    </Grid>
  );
};
