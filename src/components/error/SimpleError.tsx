import { Warning } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";

const StyledGrid = styled(Grid)`
  background-color: ${colors.lightGrey};
`;

interface Props {
  errorMessage?: string;
}

export default function SimpleError({ errorMessage }: Props) {
  return (
    <StyledGrid
      justifyContent="flex-start"
      gap="0.5rem"
      margin="1.5rem 0 0 0"
      padding="1.5rem"
    >
      <Warning color={colors.darkOrange} size={16} />
      <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
        {errorMessage || "There has been an error, please try again"}
      </Typography>
    </StyledGrid>
  );
}
