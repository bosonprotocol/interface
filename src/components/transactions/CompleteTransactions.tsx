import { CheckSquareOffset } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { GetCompletedTxLogsByWallet } from "../../lib/utils/hooks/getTransactions/getTransactions";
import Grid from "../ui/Grid";

const CompletedGrid = styled(Grid)`
  color: ${colors.green};
`;

interface Props {
  transaction: {
    type?: string;
    timestamp?: string;
    executedBy?: string;
    hash?: string;
    status: string;
    text: string;
  };
}

const CompleteTransaction = ({ transaction }: Props) => {
  return (
    <CompletedGrid gap="0.5rem">
      {transaction.status} <CheckSquareOffset size={20} />
    </CompletedGrid>
  );
};

const completedTx = [
  {
    text: "Completed to X",
    status: "Completed"
  }
];

export const CompletedTransactions = () => {
  const { data } = GetCompletedTxLogsByWallet();
  console.log(
    "🚀  roberto --  ~ file: CompleteTransactions.tsx ~ line 40 ~ CompletedTransactions ~ data",
    data
  );
  return (
    <Grid
      flexDirection="column"
      alignItems="flex-start"
      gap="0.75rem"
      margin="0 0 2rem 0"
    >
      {completedTx.map((tx) => {
        return (
          <Grid key={tx.text}>
            <Grid>
              <strong>{tx.text}</strong>
            </Grid>
            <a>
              <CompleteTransaction transaction={tx} />
            </a>
          </Grid>
        );
      })}
    </Grid>
  );
};
