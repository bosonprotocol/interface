import { Form } from "formik";
import React from "react";

import GetStarted from "../../components/dispute/GetStarted";
import TellUsMore from "../../components/dispute/TellUsMore";
import MakeProposalCore from "../../components/modal/components/Chat/components/MakeProposalCore";
import { Exchange } from "../../lib/utils/hooks/useExchanges";

function DisputeCentreForm({
  setCurrentStep,
  currentStep,
  exchange
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
  exchange: Exchange;
}) {
  const buttonSteps = [
    ["Item was not delivered or delivered late", "Item is not as described"],
    [
      "The item received is a different colour, model, version, or size",
      "The item has a different design or material",
      "The item is damaged or is missing parts",
      "The item was advertised as authentic but is not authentic",
      "The condition of the item is misrepresented (e.g., the item is described as new but is used)",
      "Other ..."
    ]
  ];

  const formComponent = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        return (
          <GetStarted
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            buttonSteps={buttonSteps}
          />
        );
      case 1:
        return (
          <TellUsMore
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
            buttonSteps={buttonSteps}
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
          />
        );
      default:
        return 0;
    }
  };

  return <Form>{formComponent(currentStep)}</Form>;
}

export default DisputeCentreForm;
