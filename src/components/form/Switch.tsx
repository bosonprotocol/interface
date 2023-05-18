import * as ReactSwitch from "@radix-ui/react-switch";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";

const height = "20px";
const StyledSwitchRoot = styled(ReactSwitch.Root)`
  width: calc(${height} * 1.68);
  height: ${height};
  background-color: hsl(0 0% 0% / 0.439);
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px hsl(0 0% 0% / 0.141);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  :focus {
    box-shadow: 0 0 0 2px ${colors.secondary};
  }
  &[data-state="checked"] {
    background-color: ${colors.secondary};
  }
`;

const StyledSwitchThumb = styled(ReactSwitch.Thumb)`
  display: block;
  width: calc(${height} - 4px);
  height: calc(${height} - 4px);
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 2px 2px hsl(0 0% 0% / 0.141);
  transition: transform 100ms;
  transform: translateX(2px);
  will-change: transform;

  &[data-state="checked"] {
    transform: translateX(calc(${height} - 6px));
  }
`;

type SwitchProps = Parameters<typeof ReactSwitch.Root>[0] & {
  label?: ReactNode;
  gridProps?: Omit<Parameters<typeof Grid>[0], "children">;
};

const Switch: React.FC<SwitchProps> = ({ label, gridProps, ...rest }) => {
  return (
    <Grid justifyContent="flex-start" gap="1rem" {...gridProps}>
      <StyledSwitchRoot {...rest} data-root>
        <StyledSwitchThumb data-thumb />
      </StyledSwitchRoot>
      {label}
    </Grid>
  );
};

export default Switch;
