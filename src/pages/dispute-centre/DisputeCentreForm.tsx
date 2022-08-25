import { Form } from "formik";
import React from "react";

import GetStarted from "../../components/dispute/GetStarted";
import TellUsMore from "../../components/dispute/TellUsMore";
import MakeProposalCore from "../../components/modal/components/Chat/components/MakeProposalCore";
import { Exchange } from "../../lib/utils/hooks/useExchanges";

function DisputeCentreForm({
  setCurrentStep,
  currentStep,
  exchange,
  submitError
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
  exchange: Exchange;
  submitError: Error | null;
}) {
  const getStartedSteps = [
    { label: "Item was not delivered or delivered late", id: 1 },
    { label: "Item is not as described", id: 2 }
  ];

  const tellUsMoreSteps = [
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
  ];

  const formComponent = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return (
          <GetStarted
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            getStartedSteps={getStartedSteps}
          />
        );
      case 1:
        return (
          <TellUsMore
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            tellUsMoreSteps={tellUsMoreSteps}
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
