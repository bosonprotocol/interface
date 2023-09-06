import { Warning, WARNING_LEVEL } from "lib/constants/tokenSafety";
import { colors } from "lib/styles/colors";
import { Prohibit, Warning as WarningTriangle } from "phosphor-react";
import styled, { css } from "styled-components";

const WarningContainer = styled.div`
  margin-left: 4px;
  display: flex;
  justify-content: center;
`;

const WarningIconStyle = css<{ size?: string }>`
  width: ${({ size }) => size ?? "1em"};
  height: ${({ size }) => size ?? "1em"};
`;

const WarningIcon = styled(WarningTriangle)`
  ${WarningIconStyle};
  color: ${({ theme }) => theme.textTertiary};
`;

const BlockedIcon = styled(Prohibit)`
  ${WarningIconStyle}
  color: ${colors.lightGrey};
`;

export default function TokenSafetyIcon({
  warning
}: {
  warning: Warning | null;
}) {
  switch (warning?.level) {
    case WARNING_LEVEL.BLOCKED:
      return (
        <WarningContainer>
          <BlockedIcon data-cy="blocked-icon" strokeWidth={2.5} />
        </WarningContainer>
      );
    case WARNING_LEVEL.UNKNOWN:
      return (
        <WarningContainer>
          <WarningIcon />
        </WarningContainer>
      );
    default:
      return null;
  }
}
