import { Formik } from "formik";
import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import ExchangePreview from "../../components/modal/components/Chat/components/ExchangePreview";
import {
  disputeCentreInitialValues,
  disputeCentreValidationSchemaAdditionalInformation,
  disputeCentreValidationSchemaGetStarted,
  disputeCentreValidationSchemaMakeProposal,
  disputeCentreValidationSchemaProposalSummary,
  disputeCentreValidationSchemaTellUsMore
} from "../../components/product/utils";
import MultiSteps from "../../components/step/MultiSteps";
import { colors } from "../../lib/styles/colors";
import { useExchanges } from "../../lib/utils/hooks/useExchanges";
import DisputeCentreForm from "./DisputeCentreForm";

const DISPUTE_STEPS = [
  {
    name: "Choose isue",
    steps: 1
  } as const,
  {
    name: "Describe problem",
    steps: 1
  } as const,
  {
    name: "Additional details",
    steps: 1
  } as const,
  {
    name: "Make a proposal",
    steps: 1
  } as const,
  {
    name: "Review & Submit",
    steps: 1
  } as const
];

const ItemWidget = styled.div``;

const DisputeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: ${colors.lightGrey};
`;

const GetStartedBox = styled.div`
  width: 41.75rem;
  padding: 2rem;
  margin-top: 1rem;
  background: ${colors.white};
  margin-bottom: 3.125rem;
  height: max-content;
  [get-started] {
    padding-bottom: 3.125rem;
  }
`;

const MultiStepsContainer = styled.div`
  padding-bottom: 0.5rem;
`;

const ItemPreview = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  width: 41.75rem;
  background-color: ${colors.white};
  margin-top: 2rem;
  padding: 2rem;
`;

function DisputeCentre() {
  const [currentStep, setCurrentStep] = useState(0);
  const params = useParams();
  const exchangeId = params["*"];

  const { data: exchanges } = useExchanges(
    {
      id: exchangeId,
      disputed: null
    },
    {
      enabled: !!"1"
    }
  );

  const [exchange] = exchanges || [];

  const handleClickStep = (val: number) => {
    if (val < currentStep) {
      setCurrentStep(val);
    }
  };

  const validationSchema = [
    disputeCentreValidationSchemaGetStarted,
    disputeCentreValidationSchemaTellUsMore,
    disputeCentreValidationSchemaAdditionalInformation,
    disputeCentreValidationSchemaMakeProposal,
    disputeCentreValidationSchemaProposalSummary
  ];

  return (
    <>
      <MultiStepsContainer>
        <MultiSteps
          data={DISPUTE_STEPS}
          active={currentStep}
          callback={handleClickStep}
        />
      </MultiStepsContainer>
      <DisputeContainer>
        <ItemPreview>
          {exchange && <ExchangePreview exchange={exchange} />}
        </ItemPreview>
        <GetStartedBox>
          <ItemWidget>
            <Formik
              initialValues={disputeCentreInitialValues}
              onSubmit={() => {
                // TODO- submitting form
                console.log("submitted");
              }}
              validationSchema={validationSchema[currentStep]}
            >
              {(formikProps) => (
                <DisputeCentreForm
                  setCurrentStep={setCurrentStep}
                  currentStep={currentStep}
                  exchange={exchange}
                  {...formikProps}
                />
              )}
            </Formik>
          </ItemWidget>
        </GetStartedBox>
      </DisputeContainer>
    </>
  );
}

export default DisputeCentre;
