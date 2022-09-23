import { ArrowCircleUp } from "phosphor-react";

import { CONFIG } from "../../../../../lib/config";
import { colors } from "../../../../../lib/styles/colors";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";

interface Props {
  action: string;
  txHash: string;
}

export default function TransactionSubmittedModal({ action, txHash }: Props) {
  return (
    <Grid
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
    >
      <ArrowCircleUp size={128} color={colors.green} />

      <Typography fontWeight="600" $fontSize="1.5rem" lineHeight="150%">
        {action} transaction submitted
      </Typography>
      <a href={CONFIG.getTxExplorerUrl?.(txHash)} target="_blank">
        <Typography
          fontWeight="400"
          $fontSize="1rem"
          lineHeight="150%"
          margin="0.5rem 0 1.5rem 0"
          color={colors.secondary}
        >
          View on Explorer
        </Typography>
      </a>
    </Grid>
  );
}
