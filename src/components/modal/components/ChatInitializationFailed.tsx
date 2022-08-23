import { WarningCircle } from "phosphor-react";
import styled from "styled-components";

import Grid from "../../ui/Grid";
import Typography from "../../ui/Typography";

const ErrorIcon = styled(WarningCircle)`
  width: 6.75rem;
  height: 6.75rem;
  margin-bottom: 1rem;
  color: #f46a6a;
`;

export default function ChatInitializationFailed() {
  return (
    <Grid flexDirection="column" alignItems="center" padding="0 0 2.5rem 0">
      <ErrorIcon />
      <Typography tag="h5" margin="0" fontSize="2.25rem">
        Chat initialization Failed
      </Typography>
      <Typography tag="p" fontSize="0.875rem" margin="1rem auto">
        Please try again
      </Typography>
    </Grid>
  );
}
