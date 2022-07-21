import React from "react";

import { StepStyle } from "./Step.styles";

export enum StepState {
  Inactive = "inactive",
  Active = "active",
  Done = "done"
}

export interface Props {
  className?: string;
  onClick?: () => void;
  state?: StepState;
}

export default function Step({ state = StepState.Inactive, ...props }: Props) {
  return (
    <StepStyle state={state} {...props}>
      <div />
    </StepStyle>
  );
}
