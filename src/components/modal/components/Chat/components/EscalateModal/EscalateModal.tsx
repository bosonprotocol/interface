import { ArrowLeft, ArrowRight } from "phosphor-react";
import React, { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
import { zIndex } from "../../../../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../../../../lib/utils/hooks/useBreakpoints";
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
  z-index: ${zIndex.Popper};
`;

const StyledButtonGrid = styled(Grid)<{ isMobile: boolean }>`
  background: ${colors.white};
  z-index: ${zIndex.Popper};
  p {
    margin-top: ${({ isMobile }) => isMobile && "1.8125rem"};
  }
`;

const buttonSteps = ["Next", "Escalate Dispute", "Done"];

const StyledButton = styled.button`
  border: none;
  background: none;
  &:disabled {
    color: ${colors.lightGrey};
  }
`;

const multiStepsData = [
  { steps: 1, name: "Dispute Overview" },
  { steps: 1, name: "Escalate Dispute" },
  { steps: 1, name: "Contact Dispute Resolver" }
];

function EscalateModal({ exchange }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const { isXS, isXXS, isS } = useBreakpoints();

  const escalateSteps = (activeStep: number) => {
    switch (activeStep) {
      case 0:
        return <EscalateStepOne exchange={exchange} />;
      case 1:
        return <EscalateStepTwo />;
      case 2:
        return <EscalateFinalStep exchange={exchange} />;
      default:
        return 0;
    }
  };

  return (
    <Container>
      <StyledButtonGrid
        alignItems="center"
        justifyContent="center"
        isMobile={isS || isXXS || isXS}
        padding={isS || isXXS || isXS ? "0 0 0.625rem 0" : "0"}
      >
        {(isS || isXXS || isXS) && (
          <StyledButton
            onClick={() => {
              setActiveStep(activeStep - 1);
            }}
            disabled={activeStep === 0}
          >
            <ArrowLeft size={27} />
          </StyledButton>
        )}
        <StyledMultiSteps
          data={multiStepsData}
          callback={(step) => {
            setActiveStep(step);
          }}
          active={activeStep}
          disableInactiveSteps
        />
        {(isS || isXXS || isXS) && (
          <StyledButton
            onClick={() => {
              setActiveStep(activeStep + 1);
            }}
            disabled={activeStep === 2}
          >
            <ArrowRight size={27} />
          </StyledButton>
        )}
      </StyledButtonGrid>
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
