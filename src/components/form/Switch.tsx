import * as ReactSwitch from "@radix-ui/react-switch";
import { useField } from "formik";
import React, { ReactElement, ReactNode } from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import Grid from "../ui/Grid";
import Input from "./Input";

const height = "20px";
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
    transform: translateX(calc(${height} - 4px));
  }
`;

const StyledSwitchRoot = styled(ReactSwitch.Root)`
  min-width: calc(${height} * 1.68);
  height: ${height};
  background-color: hsl(0 0% 0% / 0.439);
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px hsl(0 0% 0% / 0.141);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  &[data-state="checked"] {
    background-color: ${colors.secondary};
  }
  &:disabled {
    cursor: not-allowed;
    ~ *,
    * {
      color: ${colors.darkGrey};
      cursor: not-allowed;
    }
    ${StyledSwitchThumb} {
      background-color: ${colors.darkGrey};
    }
  }
`;

type SwitchProps = Parameters<typeof ReactSwitch.Root>[0] & {
  label?: ({
    toggleFormValue,
    checked
  }: {
    toggleFormValue?: () => unknown;
    checked: boolean | undefined;
  }) => ReactElement;
  gridProps?: Omit<Parameters<typeof Grid>[0], "children">;
};

export const SwitchForm: React.FC<
  Omit<SwitchProps, "checked"> & {
    name: string;
    leftChildren?: boolean;
    invertValue?: boolean;
  }
> = ({ invertValue, ...props }) => {
  const { name } = props;
  const [field, , helpers] = useField(name ?? "");
  return (
    <Switch
      {...props}
      onCheckedChange={(checked) => {
        helpers.setValue(invertValue ? !checked : checked);
      }}
      toggleFormValue={() => {
        helpers.setValue(!field.value);
      }}
      checked={invertValue ? !field.value : field.value}
    >
      <Input type="hidden" name={name} />
    </Switch>
  );
};
export const Switch: React.FC<
  SwitchProps & {
    children?: ReactNode;
    toggleFormValue?: () => unknown;
    leftChildren?: boolean;
  }
> = ({
  label,
  gridProps,
  children,
  toggleFormValue,
  leftChildren,
  ...rest
}) => {
  return (
    <Grid justifyContent="flex-start" gap="1rem" {...gridProps}>
      {leftChildren && label?.({ toggleFormValue, checked: rest.checked })}
      <StyledSwitchRoot {...rest} data-root>
        <StyledSwitchThumb data-thumb />
      </StyledSwitchRoot>
      {!leftChildren && label?.({ toggleFormValue, checked: rest.checked })}
      {children}
    </Grid>
  );
};
