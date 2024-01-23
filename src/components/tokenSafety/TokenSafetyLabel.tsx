import { Typography } from "components/ui/Typography";
import { WARNING_LEVEL } from "lib/constants/tokenSafety";
import {
  useTokenWarningColor,
  useTokenWarningTextColor
} from "lib/utils/hooks/useTokenWarningColor";
import { Prohibit, Warning } from "phosphor-react";
import { ReactNode } from "react";
import styled from "styled-components";

const Label = styled.div<{ color: string; backgroundColor: string }>`
  padding: 4px 4px;
  font-size: 0.75rem;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 8px;
  color: ${({ color }) => color};
  display: inline-flex;
  align-items: center;
`;

const Title = styled(Typography)`
  margin-right: 5px;
  font-weight: 700;
  font-size: 0.75rem;
`;

type TokenWarningLabelProps = {
  level: WARNING_LEVEL;
  canProceed: boolean;
  children: ReactNode;
};
export default function TokenSafetyLabel({
  level,
  canProceed,
  children
}: TokenWarningLabelProps) {
  return (
    <Label
      color={useTokenWarningTextColor(level)}
      backgroundColor={useTokenWarningColor(level)}
    >
      <Title marginRight="5px">{children}</Title>
      {canProceed ? (
        <Warning strokeWidth={2.5} size="14px" />
      ) : (
        <Prohibit strokeWidth={2.5} size="14px" />
      )}
    </Label>
  );
}
