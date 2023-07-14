import { CheckCircle, Info } from "phosphor-react";
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

export const ICONS = {
  info: <StyledInfo color={colors.white} />,
  checkCircle: <StyledCheckedCircle color={colors.green} />
} as const;

export const ICON_KEYS = {
  info: "info",
  checkCircle: "checkCircle"
} as const;

export enum StringIconTypes {
  RETRACT = "RETRACT"
}
