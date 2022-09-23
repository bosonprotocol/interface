import { WarningCircle } from "phosphor-react";

import { colors } from "../../../../../lib/styles/colors";
import Grid from "../../../../ui/Grid";
import Typography from "../../../../ui/Typography";

export default function ConfirmationFailedModal() {
  return (
    <Grid flexDirection="column" alignItems="center">
      <WarningCircle size={128} color={colors.orange} />

      <Typography fontWeight="600" $fontSize="1.5rem" lineHeight="150%">
        Confirmation Failed
      </Typography>
      <Typography
        fontWeight="400"
        $fontSize="1rem"
        lineHeight="150%"
        margin="0.5rem 0 1.5rem 0"
      >
        Please retry this action
      </Typography>
    </Grid>
  );
}
