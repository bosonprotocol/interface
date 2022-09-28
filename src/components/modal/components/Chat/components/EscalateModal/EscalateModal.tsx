import { ArrowLeft, ArrowRight } from "phosphor-react";
import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
import { zIndex } from "../../../../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../../../lib/utils/useCoreSdk";
import SimpleError from "../../../../../error/SimpleError";
import MultiSteps from "../../../../../step/MultiSteps";
import Button from "../../../../../ui/Button";
import Grid from "../../../../../ui/Grid";
import ExchangePreview from "../ExchangePreview";
import EscalateFinalStep from "./steps/EscalateFinalStep";
import EscalateStepOne from "./steps/EscalateStepOne";
import EscalateStepTwo from "./steps/EscalateStepTwo";

interface Props {
  exchange: Exchange;
  hideModal: () => void;
}

const Container = styled.div`
  background: ${colors.lightGrey};
`;

const StyledMultiSteps = styled(MultiSteps)`
  background: ${colors.white};
  padding-bottom: 0.625rem;
  margin-bottom: 0.9375rem;
`;

const InnerContainer = styled.div`
  max-width: 50rem;
  display: block;
  margin: 1.5rem auto;
  padding: 0 0 1.5rem 0;
`;

const StyledGrid = styled(Grid)`
  background: ${colors.white};
  z-index: ${zIndex.Popper};
`;

const StyledButtonGrid = styled(Grid)<{ isLteS: boolean }>`
  background: ${colors.white};
  z-index: ${zIndex.Popper};
  p {
    margin-top: ${({ isLteS }) => isLteS && "1.8125rem"};
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

function EscalateModal({ exchange, hideModal }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(false);
  const { isLteS } = useBreakpoints();
  const coreSDK = useCoreSDK();

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
        isLteS={isLteS}
        padding={isLteS ? "0 0 0.625rem 0" : "0"}
      >
        {isLteS && (
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
        {isLteS && (
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
            theme="primary"
            onClick={async () => {
              if (activeStep + 1 < buttonSteps.length) {
                setActiveStep(activeStep + 1);
              }
              if (activeStep + 1 === buttonSteps.length) {
                try {
                  const tx = await coreSDK.escalateDispute(exchange.id);
                  await tx.wait();
                  hideModal();
                } catch (error) {
                  console.error(error);
                  setError(true);
                }
              }
            }}
          >
            {buttonSteps[activeStep]}
          </Button>
        </StyledGrid>
        {error && <SimpleError />}
      </InnerContainer>
    </Container>
  );
}

export default EscalateModal;
