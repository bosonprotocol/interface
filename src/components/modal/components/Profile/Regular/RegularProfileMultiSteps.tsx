import { useState } from "react";

import MultiSteps from "../../../../step/MultiSteps";
import Grid from "../../../../ui/Grid";

interface Props {
  isCreate: boolean;
  activeStep: number;
  setStepBasedOnIndex?: (index: number) => void;
}

export function RegularProfileMultiSteps({
  isCreate,
  activeStep: initialActiveStep,
  setStepBasedOnIndex
}: Props) {
  const [activeStep, setActiveStep] = useState<number>(initialActiveStep);
  return (
    <Grid justifyContent="space-evently">
      <MultiSteps
        data={
          isCreate
            ? [
                {
                  steps: 1,
                  name: "Create Profile"
                },
                {
                  steps: 1,
                  name: "Create Royalties"
                },
                { steps: 1, name: "Confirmation" }
              ]
            : [
                { steps: 1, name: "Edit Profile" },
                { steps: 1, name: "View Royalties" }
              ]
        }
        active={activeStep}
        callback={(step) => {
          setStepBasedOnIndex?.(step);
          setActiveStep(step);
        }}
        disableInactiveSteps
      />
    </Grid>
  );
}
