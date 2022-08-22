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
import Grid from "../../components/ui/Grid";
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

const DisputeContainer = styled(Grid)`
  height: 100%;
  background: ${colors.lightGrey};
`;

const GetStartedBox = styled.div`
  width: 41.75rem;
  padding: 2rem;
  margin-top: 1rem;
  background: ${colors.white};
  margin-bottom: 3.125rem;
  height: max-content;
`;

const MultiStepsContainer = styled.div`
  padding-bottom: 0.5rem;
`;

const ItemPreview = styled(Grid)`
  width: 41.75rem;
  background-color: ${colors.white};
`;

function DisputeCentre() {
  const [currentStep, setCurrentStep] = useState(0);
  const params = useParams();
  const exchangeId = params["*"];

  const { data: exchanges = [] } = useExchanges({
    id: exchangeId,
    disputed: null
  });

  const [exchange] = exchanges;

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
      <DisputeContainer
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <ItemPreview
          justifyContent="space-between"
          margin="2rem 0 0 0"
          padding="2rem"
        >
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
