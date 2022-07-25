import * as Tooltip from "@radix-ui/react-tooltip";
import { Question } from "phosphor-react";
import { ReactNode } from "react";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";

interface Props {
  children?: ReactNode;
  trigger?: ReactNode;
}

const StyledContent = styled(Tooltip.Content)`
  position: absolute;
  background: ${colors.white};
  color: ${colors.black};
  padding: 1rem;
  z-index: ${zIndex.Popper};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1), 0px 0px 8px rgba(0, 0, 0, 0.1),
    0px 0px 16px rgba(0, 0, 0, 0.1), 0px 0px 32px rgba(0, 0, 0, 0.1);

  bottom: -1.5rem;

  left: 0;
  min-width: 65vw;
  transform: translate(-5rem, 100%);

  ${breakpoint.s} {
    left: 50%;
    min-width: 25rem;
    transform: translate(-50%, 100%);
  }

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.55rem solid ${colors.white};
    top: 0;

    left: 0.75rem;
    transform: translate(5rem, -0.5rem);
    ${breakpoint.s} {
      left: 50%;
      transform: translate(-50%, -0.5rem);
    }
  }
`;

const Trigger = styled(Tooltip.Trigger)`
  all: unset;
  cursor: pointer;
  display: flex;
  margin-left: 0.5rem;
`;

export default function DetailTooltip({ children, trigger }: Props) {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Trigger>{trigger || <Question size={20} weight="regular" />}</Trigger>
        <Tooltip.Portal>
          <StyledContent>{children}</StyledContent>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
