import { RecordWithSameKeyAndValue } from "lib/types/record";
import { CheckCircle, Info, WarningCircle } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../../lib/styles/colors";

const StyledInfo = styled(Info)`
  filter: drop-shadow(1px 1px 4px ${colors.blue});
  circle[stroke] {
    fill: ${colors.blue};
    stroke: ${colors.blue};
  }
`;

const StyledCheckedCircle = styled(CheckCircle)`
  circle[stroke] {
    stroke: ${colors.green};
  }
`;

const StyledWarningCircle = styled(WarningCircle)`
  circle[stroke] {
    stroke: ${colors.orange};
  }
`;

export const ICONS = {
  info: <StyledInfo color={colors.white} />,
  checkCircle: <StyledCheckedCircle color={colors.green} />,
  warningCircle: <StyledWarningCircle color={colors.orange} />
} as const;

export const ICON_KEYS: RecordWithSameKeyAndValue<typeof ICONS> = {
  info: "info",
  checkCircle: "checkCircle",
  warningCircle: "warningCircle"
};

export enum StringIconTypes {
  RETRACT = "RETRACT",
  ERROR = "ERROR"
}
