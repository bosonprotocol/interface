import React, { useEffect, useState } from "react";

import Grid from "../ui/Grid";
import Typography from "../ui/Typography";
import Step, { StepState } from "./Step";
import { MultiStepStyle, StepWrapper } from "./Step.styles";

type StepData = {
  name?: string;
  steps: { label?: string }[];
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
    <MultiStepStyle {...props}>
      {data.map((el, i) => {
        const steps = el.steps;
        const newData = data.slice(0, i);
        const previousLength = newData.reduce(
          (acc, cur) => (acc += cur.steps.length),
          0
        );
        return (
          <Grid flexDirection="column" flexGrow="1" key={`multi_${i}`}>
            <Grid flexDirection="row" alignItems="flex-start">
              {steps.map((step, key: number) => {
                const currentKey = previousLength + key;
                const state =
                  currentKey === current
                    ? StepState.Active
                    : currentKey < current
                    ? StepState.Done
                    : StepState.Inactive;
                return (
                  <Grid flexDirection="column" justifyContent="flex-start">
                    <StepWrapper
                      flexDirection="column"
                      key={`multi-step_${currentKey}`}
                      flexWrap="nowrap"
                      gap="0"
                    >
                      <Step
                        state={state}
                        onClick={() => {
                          setCurrent(currentKey);
                          if (callback) {
                            callback(currentKey);
                          }
                        }}
                      />
                    </StepWrapper>
                    {step.label && (
                      <Typography tag="p" margin="0.5rem 0 0 0">
                        {step.label}
                      </Typography>
                    )}
                  </Grid>
                );
              })}
            </Grid>
            <Typography tag="p" margin="0">
              {el.name}
            </Typography>
          </Grid>
        );
      })}
    </MultiStepStyle>
  );
}
