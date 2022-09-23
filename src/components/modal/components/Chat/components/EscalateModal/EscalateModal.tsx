import { ArrowLeft, ArrowRight } from "phosphor-react";
import { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";

import { CONFIG } from "../../../../../../lib/config";
import { colors } from "../../../../../../lib/styles/colors";
import { zIndex } from "../../../../../../lib/styles/zIndex";
import { useBreakpoints } from "../../../../../../lib/utils/hooks/useBreakpoints";
import { Exchange } from "../../../../../../lib/utils/hooks/useExchanges";
import { useCoreSDK } from "../../../../../../lib/utils/useCoreSdk";
import SimpleError from "../../../../../error/SimpleError";
import MultiSteps from "../../../../../step/MultiSteps";
import SuccessTransactionToast from "../../../../../toasts/SuccessTransactionToast";
import Button from "../../../../../ui/Button";
import Grid from "../../../../../ui/Grid";
import { useModal } from "../../../../useModal";
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
  margin: 0 auto;
  padding-bottom: 1.5625rem;
  margin-bottom: 1.5625rem;
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
  const { showModal } = useModal();
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
                  showModal("WAITING_FOR_CONFIRMATION");
                  const tx = await coreSDK.escalateDispute(exchange.id);
                  showModal("TRANSACTION_SUBMITTED", {
                    action: "Escalate dispute",
                    txHash: tx.hash
                  });
                  await tx.wait();
                  toast((t) => (
                    <SuccessTransactionToast
                      t={t}
                      action={`Raised dispute: ${exchange.offer.metadata.name}`}
                      url={CONFIG.getTxExplorerUrl?.(tx.hash)}
                    />
                  ));
                  hideModal();
                } catch (error) {
                  console.error(error);
                  const hasUserRejectedTx =
                    (error as unknown as { code: string }).code ===
                    "ACTION_REJECTED";
                  if (hasUserRejectedTx) {
                    showModal("CONFIRMATION_FAILED");
                  }

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
