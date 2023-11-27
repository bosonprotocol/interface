import Loading from "components/ui/Loading";
import styled from "styled-components";

import GridContainer from "../ui/GridContainer";

const margin = "1.75rem";
const StyledGridContainer = styled(GridContainer)`
  margin-top: ${margin};
  margin-bottom: ${margin};
  justify-items: center;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex: 1;
`;
const Message = styled.p`
  white-space: pre-line;
`;

export type LoadingMessageProps = {
  message?: string;
};
export function LoadingMessage({ message, ...rest }: LoadingMessageProps) {
  return (
    <StyledGridContainer
      itemsPerRow={{
        xs: 1,
        s: 1,
        m: 1,
        l: 1,
        xl: 1
      }}
      defaultSize="minmax(0, max-content)"
      columnGap="10rem"
      rowGap="5rem"
      {...rest}
    >
      {message && <Message className="message">{message}</Message>}
      <Loading />
    </StyledGridContainer>
  );
}
