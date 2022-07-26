import React, { useEffect, useState } from "react";

import Step, { StepState } from "./Step";
import { MultiStepStyle, MultiStepWrapper, StepWrapper } from "./Step.styles";

type StepData = {
  name?: string;
  steps: number;
};

interface Props {
  active?: number;
  data: Array<StepData>;
  callback?: (cur: number) => void;
}
export default function MultiSteps({
  data,
  active,
  callback,
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
          <MultiStepWrapper key={`multi_${i}`}>
            <StepWrapper>
              {steps.map((step: number, key: number) => {
                const currentKey = previousLength + key;
                const state =
                  currentKey === current
                    ? StepState.Active
                    : currentKey < current
                    ? StepState.Done
                    : StepState.Inactive;
                return (
                  <Step
                    state={state}
                    onClick={() => {
                      setCurrent(currentKey);
                      if (callback) {
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
