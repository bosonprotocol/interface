import { Warning } from "phosphor-react";
import { ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import { Grid, GridProps } from "../ui/Grid";
import { Typography } from "../ui/Typography";

const StyledGrid = styled(Grid)`
  background-color: ${colors.greyLight};
`;

interface Props extends GridProps {
  errorMessage?: string;
  children?: ReactNode;
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
      <Warning color={colors.orangeDark} size={16} />
      {children ? (
        children
      ) : (
        <Typography fontWeight="600" fontSize="1rem" lineHeight="1.5rem">
          {errorMessage || "There has been an error, please try again"}
        </Typography>
      )}
    </StyledGrid>
  );
}
