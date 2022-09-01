import React, { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import MultiSteps from "../../../../../step/MultiSteps";
import Button from "../../../../../ui/Button";
import Grid from "../../../../../ui/Grid";
import ExchangePreview from "../ExchangePreview";
import EscalateFinalStep from "./steps/EscalateFinalStep";
import EscalateStepOne from "./steps/EscalateStepOne";
import EscalateStepTwo from "./steps/EscalateStepTwo";

interface Props {
  exchange: Exchange;
}

const Container = styled.div`
  background: ${colors.lightGrey};
`;

const StyledMultiSteps = styled(MultiSteps)`
  background: ${colors.white};
  padding-bottom: 0.625rem;
  margin-bottom: 15px;
`;

const InnerContainer = styled.div`
  max-width: 50rem;
  display: block;
  margin: 0 auto;
  padding-bottom: 1.5625rem;
  margin-bottom: 1.5625rem;
`;

const StyledGrid = styled(Grid)`
  background: ${colors.white};
`;

const buttonSteps = ["Next", "Escalate Dispute", "Done"];

const multiStepsData = [
  { steps: 1, name: "Dispute Overview" },
  { steps: 1, name: "Escalate Dispute" },
  { steps: 1, name: "Contact Dispute Resolver" }
];

function EscalateModal({ exchange }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  const escalateSteps = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return (
          <EscalateStepOne exchange={exchange} setActiveStep={setActiveStep} />
        );
      case 1:
        return <EscalateStepTwo />;
      case 2:
        return <EscalateFinalStep />;
      default:
        return 0;
    }
  };

  return (
    <Container>
      <StyledMultiSteps
        data={multiStepsData}
        callback={(step) => {
          setActiveStep(step);
        }}
        active={activeStep}
        disableInactiveSteps
      />
      <InnerContainer>
        <StyledGrid padding="2rem">
          <ExchangePreview exchange={exchange} />
        </StyledGrid>
        {escalateSteps(activeStep)}
        <StyledGrid padding="0 0 2rem 2rem">
          <Button
            theme="secondary"
            onClick={() => setActiveStep(activeStep + 1)}
          >
            {buttonSteps[activeStep]}
          </Button>
        </StyledGrid>
      </InnerContainer>
    </Container>
  );
}

export default EscalateModal;
