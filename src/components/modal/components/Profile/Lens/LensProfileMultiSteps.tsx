import { useState } from "react";

import MultiSteps from "../../../../step/MultiSteps";
import Grid from "../../../../ui/Grid";
import { LensStep } from "./const";

interface Props {
  profileOption: "create" | "edit" | null;
  createOrViewRoyalties: "create" | "view" | null;
  activeStep: LensStep;
  setStepBasedOnIndex?: (lensStep: LensStep) => void;
}

export default function LensProfileMultiSteps({
  profileOption,
  createOrViewRoyalties,
  activeStep: initialActiveStep,
  setStepBasedOnIndex
}: Props) {
  const steps = [
    ...(profileOption === "edit"
      ? []
      : [
          {
            steps: 1,
            name: "Create or Select Profile",
            step: LensStep.CREATE_OR_CHOOSE
          }
        ]),
    {
      steps: 1,
      name: `${profileOption === "create" ? "Create Profile" : "Edit Profile"}`,
      step: profileOption === "create" ? LensStep.CREATE : LensStep.USE
    },
    {
      steps: 1,
      name: `${
        createOrViewRoyalties === "create"
          ? "Create Royalties"
          : createOrViewRoyalties === "view"
          ? "View Royalties"
          : "Create or View Royalties"
      }`,
      step: LensStep.BOSON_ACCOUNT
    },
    ...(profileOption === "create"
      ? [{ steps: 1, name: "Confirmation", step: LensStep.SUMMARY }]
      : [])
  ];
  const [activeStep, setActiveStep] = useState<number>(
    steps.findIndex((step) => step.step === initialActiveStep) || 0
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
