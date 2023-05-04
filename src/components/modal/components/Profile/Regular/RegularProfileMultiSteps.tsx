import { useState } from "react";

import MultiSteps from "../../../../step/MultiSteps";
import Grid from "../../../../ui/Grid";
import { RegularStep } from "./const";

interface Props {
  isCreate: boolean;
  activeStep: RegularStep;
  setStepBasedOnIndex?: (step: RegularStep) => void;
}

export function RegularProfileMultiSteps({
  isCreate,
  activeStep: initialActiveStep,
  setStepBasedOnIndex
}: Props) {
  const steps = isCreate
    ? [
        {
          steps: 1,
          name: "Create Profile",
          step: RegularStep.CREATE
        },
        {
          steps: 1,
          name: "Create Royalties",
          step: RegularStep.BOSON_ACCOUNT
        },
        { steps: 1, name: "Confirmation", step: RegularStep.SUMMARY }
      ]
    : [
        { steps: 1, name: "Edit Profile", step: RegularStep.CREATE },
        {
          steps: 1,
          name: "View Royalties",
          step: RegularStep.BOSON_ACCOUNT
        }
      ];
  const [activeStep, setActiveStep] = useState<number>(
    steps.findIndex((step) => step.step === initialActiveStep)
  );
  return (
    <Grid justifyContent="space-evently">
      <MultiSteps
        data={steps}
        active={activeStep}
        callback={(step) => {
          setStepBasedOnIndex?.(steps[step].step);
          setActiveStep(step);
        }}
        disableInactiveSteps
      />
    </Grid>
  );
}
