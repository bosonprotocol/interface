import { StepStyle } from "./Step.styles";

export enum StepState {
  Inactive = "inactive",
  Active = "active",
  Done = "done"
}

interface Props {
  className?: string;
  onClick?: () => void;
  state?: StepState;
  disabled?: boolean;
}

export default function Step({ state = StepState.Inactive, ...props }: Props) {
  return (
    <StepStyle state={state} {...props} disabled={!!props.disabled}>
      <div />
    </StepStyle>
  );
}
