import { ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { ReactComponent as CheckSvg } from "./check.svg";
import { ReactComponent as DotSvg } from "./dot.svg";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1;
`;

type StatusProps = { $isClickable?: boolean };
const Status = styled.div<StatusProps>`
  border: 2px solid ${colors.border};
  height: 1.25rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ $isClickable }) =>
    $isClickable &&
    `
    cursor: pointer;
  `}
`;

const Done = styled(Status)`
  background-color: ${colors.primary};
`;

const InProgress = styled(Status)`
  background-color: ${colors.black};

  > * {
    margin: 5px;
  }
`;

const ToDo = styled(Status)`
  background-color: ${colors.white};
`;

const StyledDot = styled(DotSvg)<{ $color: string }>`
  circle {
    fill: ${({ $color }) => $color};
  }
`;

interface Props {
  children?: ReactNode;
  status: "todo" | "inprogress" | "done";
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const statusToComponent = (
  statusProps: StatusProps
): Record<Props["status"], ReactNode> => {
  return {
    done: (
      <Done {...statusProps}>
        <CheckSvg />
      </Done>
    ),
    inprogress: (
      <InProgress {...statusProps}>
        <StyledDot $color={colors.primary} />
        <StyledDot $color={colors.primary} />
        <StyledDot $color={colors.primary} />
      </InProgress>
    ),
    todo: (
      <ToDo {...statusProps}>
        <StyledDot $color={colors.grey2} />
      </ToDo>
    )
  } as const;
};

export default function Step({ children, status, onClick }: Props) {
  const Components = statusToComponent({ $isClickable: !!onClick })[status];
  return (
    <Container onClick={onClick}>
      {Components}
      {children}
    </Container>
  );
}
