import { useState } from "react";
import styled from "styled-components";

import { colors } from "../../../../../../lib/styles/colors";
import { zIndex } from "../../../../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import MultiSteps from "../../../../../step/MultiSteps";
import BosonButton from "../../../../../ui/BosonButton";
import Grid from "../../../../../ui/Grid";
import ExchangePreview from "../ExchangePreview";
import EscalateStepOne from "./steps/EscalateStepOne";
import EscalateStepTwo, { EscalateChatProps } from "./steps/EscalateStepTwo";

type Props = EscalateChatProps & {
  exchange: Exchange;
  refetch: () => void;
};

const Container = styled.div`
  background: ${colors.lightGrey};
`;

const StyledMultiSteps = styled(MultiSteps)`
  background: ${colors.white};
  padding-bottom: 0.625rem;
  margin-bottom: 0.9375rem;
  position: relative;
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
`;

const buttonSteps = ["Next"];

const multiStepsData = [
  { steps: 1, name: "Dispute Context" },
  { steps: 1, name: "Escalate Dispute" }
];

function EscalateModal({
  exchange,
  refetch,
  addMessage,
  onSentMessage,
  setHasError
}: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const { isLteS } = useBreakpoints();

  const escalateSteps = (activeStep: number) => {
    switch (activeStep) {
      case 1:
        return (
          <EscalateStepTwo
            exchange={exchange}
            refetch={refetch}
            addMessage={addMessage}
            onSentMessage={onSentMessage}
            setHasError={setHasError}
          />
        );
      default:
        return <EscalateStepOne exchange={exchange} />;
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
        <StyledMultiSteps
          data={multiStepsData}
          callback={(step) => {
            setActiveStep(step);
          }}
          active={activeStep}
          disableInactiveSteps
        />
      </StyledButtonGrid>
      <InnerContainer>
        <StyledGrid padding="2rem">
          <ExchangePreview exchange={exchange} />
        </StyledGrid>
        {escalateSteps(activeStep)}
        {activeStep + 1 <= buttonSteps.length && (
          <StyledGrid padding="0 0 2rem 2rem">
            <BosonButton
              variant="primaryFill"
              onClick={() => setActiveStep(activeStep + 1)}
            >
              {buttonSteps[activeStep]}
            </BosonButton>
          </StyledGrid>
        )}
      </InnerContainer>
    </Container>
  );
}

export default EscalateModal;
