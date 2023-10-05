import { Form } from "formik";
import React, { useEffect, useState } from "react";

import GetStarted from "../../components/dispute/GetStarted";
import TellUsMore from "../../components/dispute/TellUsMore";
import MakeProposalCore from "../../components/modal/components/Chat/components/MakeProposalCore";
import { Exchange } from "../../lib/utils/hooks/useExchanges";
import { useDisputeForm } from "./const";

const getStartedSteps = [
  { label: "Item was not delivered or delivered late", id: 1 },
  { label: "Item is not as described", id: 2 }
] as const;

const tellUsMoreSteps = {
  1: [
    {
      label: "The item was not delivered",
      id: 1
    },
    { label: "The item was delivered late", id: 2 },
    { label: "Other ...", id: 3 }
  ],
  2: [
    {
      label: "The item received is a different colour, model, version, or size",
      id: 1
    },
    { label: "The item has a different design or material", id: 2 },
    { label: "The item is damaged or is missing parts", id: 3 },
    {
      label: "The item was advertised as authentic but is not authentic",
      id: 4
    },
    {
      label:
        "The condition of the item is misrepresented (e.g., the item is described as new but is used)",
      id: 5
    },
    { label: "Other ...", id: 6 }
  ]
} as const;

function DisputeCentreForm({
  setCurrentStep,
  currentStep,
  exchange,
  submitError,
  setIsRightArrowEnabled
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setIsRightArrowEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  currentStep: number;
  exchange: Exchange;
  submitError: Error | null;
}) {
  const [tellUsMoreID, setTellUsMoreId] =
    useState<keyof typeof tellUsMoreSteps>(1);
  const formValues = useDisputeForm();
  const formErrors = Object.keys(formValues.errors).length === 0;

  useEffect(() => {
    if (currentStep === 0 && formValues.values.getStarted !== "") {
      setIsRightArrowEnabled(true);
    } else if (currentStep === 1 && formValues.values.tellUsMore !== "") {
      setIsRightArrowEnabled(true);
    } else if (currentStep === 2 && formErrors) {
      setIsRightArrowEnabled(true);
    } else if (
      currentStep === 3 &&
      formErrors &&
      formValues.values.proposalType !== null
    ) {
      setIsRightArrowEnabled(true);
    } else {
      setIsRightArrowEnabled(false);
    }
  }, [formValues, setIsRightArrowEnabled, currentStep, formErrors]);

  const formComponent = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return (
          <GetStarted
            getStartedSteps={getStartedSteps}
            onClick={(step) => {
              setCurrentStep(currentStep + 1);
              setTellUsMoreId(step.id);
            }}
          />
        );
      case 1:
        return (
          <TellUsMore
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            tellUsMoreSteps={tellUsMoreSteps[tellUsMoreID]}
          />
        );
      case 2:
      case 3:
      case 4:
        return (
          <MakeProposalCore
            setActiveStep={setCurrentStep}
            activeStep={currentStep}
            exchange={exchange}
            submitError={submitError}
          />
        );
      default:
        return 0;
    }
  };

  return <Form>{formComponent(currentStep)}</Form>;
}

export default DisputeCentreForm;
