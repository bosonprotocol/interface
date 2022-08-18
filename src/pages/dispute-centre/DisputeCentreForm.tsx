import { Form } from "formik";
import React from "react";

import AdditionalInformation from "../../components/dispute/AdditionalInformation";
import GetStarted from "../../components/dispute/GetStarted";
import MakeProposal from "../../components/dispute/MakeProposal";
import RequestOverview from "../../components/dispute/RequestOverview";
import TellUsMore from "../../components/dispute/TellUsMore";

function DisputeCentreForm({
  setCurrentStep,
  currentStep
}: {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
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
        return <AdditionalInformation />;
      case 3:
        return (
          <MakeProposal
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
          />
        );
      case 4:
        return (
          <RequestOverview
            setCurrentStep={setCurrentStep}
            currentStep={currentStep}
          />
        );
      default:
        return 0;
    }
  };

  return <Form>{formComponent(currentStep)}</Form>;
}

export default DisputeCentreForm;
