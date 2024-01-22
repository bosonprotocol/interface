import { breakpoint } from "lib/styles/breakpoint";
import { ReactNode } from "react";
import styled from "styled-components";

import { Grid } from "../ui/Grid";
import { GridContainer } from "../ui/GridContainer";

const margin = "1.75rem";
const StyledGridContainer = styled(GridContainer)`
  margin-top: ${margin};
  margin-bottom: ${margin};
  justify-items: center;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex: 1;
  ${breakpoint.m} {
    justify-items: end;
    justify-content: space-between;
  }
`;
const Title = styled.div`
  white-space: pre-line;
  margin: 0;
  font-size: 3.5rem;
  font-weight: 600;
  line-height: 1.2;
`;
const Message = styled.p`
  white-space: pre-line;
`;

export type ErrorMessageProps = {
  cta?: ReactNode;
  img: ReactNode;
  title: string;
  message?: string;
};
export function ErrorMessage({
  cta: CTA,
  img,
  title,
  message,
  ...rest
}: ErrorMessageProps) {
  return (
    <StyledGridContainer
      itemsPerRow={{
        xs: 1,
        s: 1,
        m: 2,
        l: 2,
        xl: 2
      }}
      defaultSize="minmax(0, max-content)"
      columnGap="10rem"
      rowGap="5rem"
      {...rest}
    >
      <Grid
        flexDirection="column"
        gap="1rem"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Title className="title">{title}</Title>
        {message && <Message className="message">{message}</Message>}
        {CTA}
      </Grid>
      {img}
    </StyledGridContainer>
  );
}
