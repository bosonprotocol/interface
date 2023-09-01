import AnimatedDropdown from "components/animatedDropdown";
import Column from "components/ui/column";
import Grid from "components/ui/Grid";
import { CaretDown } from "phosphor-react";
import { PropsWithChildren, ReactElement } from "react";
import styled from "styled-components";

const ButtonContainer = styled(Grid)`
  cursor: pointer;
  justify-content: flex-end;
  width: unset;
`;

const ExpandIcon = styled(CaretDown)<{ $isOpen: boolean }>`
  color: ${({ theme }) => colors.lightGrey};
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform ${({ theme }) => theme.transition.duration.medium};
`;

const Content = styled(Column)`
  padding-top: 12px;
`;

export default function Expand({
  header,
  button,
  children,
  testId,
  isOpen,
  onToggle
}: PropsWithChildren<{
  header: ReactElement;
  button: ReactElement;
  testId?: string;
  isOpen: boolean;
  onToggle: () => void;
}>) {
  return (
    <Column>
      <Grid>
        {header}
        <ButtonContainer
          data-testid={testId}
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          {button}
          <ExpandIcon $isOpen={isOpen} />
        </ButtonContainer>
      </Grid>
      <AnimatedDropdown open={isOpen}>
        <Content gap="md">{children}</Content>
      </AnimatedDropdown>
    </Column>
  );
}
