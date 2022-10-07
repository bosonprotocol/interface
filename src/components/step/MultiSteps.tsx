import { useEffect, useState } from "react";

import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
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
  disableInactiveSteps = false,
  ...props
}: Props) {
  const [current, setCurrent] = useState<number>(active || 0);
  const { isLteS } = useBreakpoints();

  useEffect(() => {
    setCurrent(active || 0);
  }, [active]);

  return (
    <MultiStepStyle {...props} data-steps-wrapper isLteS={isLteS}>
      {data.map((el, i) => {
        const steps = Array.from(Array(el.steps).keys());
        const newData = data.slice(0, i);
        const previousLength = newData.reduce(
          (acc, cur) => (acc += cur.steps),
          0
        );
        if (
          (isLteS &&
            current >= previousLength &&
            current <= previousLength + steps.length) ||
          !isLteS
        ) {
          return (
            <MultiStepWrapper isLteS={isLteS} key={`multi_${i}`}>
              <StepWrapper>
                {steps.map((_: number, key: number) => {
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

                  if ((isLteS && active === currentKey) || !isLteS) {
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
                  }
                })}
              </StepWrapper>
              <p>{el.name}</p>
            </MultiStepWrapper>
          );
        }
      })}
    </MultiStepStyle>
  );
}
