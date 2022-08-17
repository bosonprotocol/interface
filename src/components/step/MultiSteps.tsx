import React, { useEffect, useState } from "react";

import Step, { StepState } from "./Step";
import { MultiStepStyle, MultiStepWrapper, StepWrapper } from "./Step.styles";

type StepData = {
  name?: string;
  steps: number;
};

interface Props {
  disableInactiveSteps?: boolean;
  active?: number;
  data: Array<StepData>;
  callback?: (cur: number) => void;
}
export default function MultiSteps({
  data,
  active,
  callback,
  disableInactiveSteps,
  ...props
}: Props) {
  const [current, setCurrent] = useState<number>(active || 0);

  useEffect(() => {
    setCurrent(active || 0);
  }, [active]);

  return (
    <MultiStepStyle {...props} data-steps-wrapper>
      {data.map((el, i) => {
        const steps = Array.from(Array(el.steps).keys());
        const newData = data.slice(0, i);
        const previousLength = newData.reduce(
          (acc, cur) => (acc += cur.steps),
          0
        );
        return (
          <MultiStepWrapper id="multisteps_wrapper" key={`multi_${i}`}>
            <StepWrapper>
              {steps.map((step: number, key: number) => {
                const currentKey = previousLength + key;

                const state =
                  currentKey === current
                    ? StepState.Active
                    : currentKey < current
                    ? StepState.Done
                    : StepState.Inactive;
                const isStepDisabled =
                  !callback ||
                  (disableInactiveSteps && StepState.Inactive === state);
                return (
                  <Step
                    disabled={isStepDisabled}
                    state={state}
                    onClick={() => {
                      if (!isStepDisabled) {
                        setCurrent(currentKey);
                        callback(currentKey);
                      }
                    }}
                    key={`multi-step_${currentKey}`}
                  />
                );
              })}
            </StepWrapper>
            <p>{el.name}</p>
          </MultiStepWrapper>
        );
      })}
    </MultiStepStyle>
  );
}
