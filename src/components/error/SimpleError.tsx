import { Warning } from "phosphor-react";
import { ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";
import Typography from "../ui/Typography";

const StyledGrid = styled(Grid)`
  background-color: ${colors.lightGrey};
`;

interface Props {
  errorMessage?: string;
  children?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export default function SimpleError({
  errorMessage,
  children,
  ...rest
}: Props) {
  return (
    <StyledGrid
      justifyContent="flex-start"
      gap="0.5rem"
      margin="1.5rem 0 0 0"
      padding="1.5rem"
      {...rest}
    >
      <Warning color={colors.darkOrange} size={16} />
      {errorMessage ? (
        <Typography fontWeight="600" $fontSize="1rem" lineHeight="1.5rem">
          {errorMessage || "There has been an error, please try again"}
        </Typography>
      ) : (
        children
      )}
    </StyledGrid>
  );
}
