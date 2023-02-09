import { useState } from "react";

import MultiSteps from "../../../../step/MultiSteps";
import Grid from "../../../../ui/Grid";

interface Props {
  createOrSelect: "create" | "select" | null;
  createOrViewRoyalties: "create" | "view" | null;
  activeStep: 0 | 1 | 2 | 3;
  setStepBasedOnIndex?: (index: number) => void;
}

export default function ProfileMultiSteps({
  createOrSelect,
  createOrViewRoyalties,
  activeStep: initialActiveStep,
  setStepBasedOnIndex
}: Props) {
  const [activeStep, setActiveStep] = useState<number>(initialActiveStep);
  return (
    <Grid justifyContent="space-evently">
      <MultiSteps
        data={
          createOrSelect === "select" && createOrViewRoyalties === "view"
            ? [
                {
                  steps: 1,
                  name: "View Profile Details"
                }
              ]
            : [
                { steps: 1, name: "Create or Select Profile" },
                {
                  steps: 1,
                  name: `${
                    createOrSelect === "create"
                      ? "Create Profile"
                      : createOrSelect === "select"
                      ? "View Profile Details"
                      : "Create or View Profile"
                  }`
                },
                {
                  steps: 1,
                  name: `${
                    createOrViewRoyalties === "create"
                      ? "Create Royalties"
                      : createOrViewRoyalties === "view"
                      ? "View Royalties"
                      : "Create or View Royalties"
                  }`
                },
                { steps: 1, name: "Confirmation" }
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
