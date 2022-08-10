import { Plus } from "phosphor-react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useModal } from "../../../../components/modal/useModal";
import MultiSteps from "../../../../components/step/MultiSteps";
import Grid from "../../../../components/ui/Grid";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { FileWithEncodedData } from "../../../../lib/utils/files";
import { useChatContext } from "../../ChatProvider/ChatContext";
import { NewProposal, Thread } from "../../types";

const StyledButton = styled.button`
  border: 3px solid ${colors.secondary};
  padding-left: 1.2rem;
  padding-right: 2.5rem;
  font-size: 0.875rem;
  margin-right: 0.875rem;
  height: 46px;
  font-weight: 600;
  color: ${colors.secondary};
  background-color: transparent;
  position: relative;
  cursor: pointer;
  svg {
    position: absolute;
    top: 50%;
    right: 0.6rem;
    transform: translateY(-50%) scale(0.7);
    ${breakpoint.m} {
      transform: translateY(-50%);
    }
  }
  :disabled {
    cursor: not-allowed;
  }
`;

const StyledMultiSteps = styled(MultiSteps)`
  width: 100%;
`;

interface Props {
  exchange: NonNullable<Thread["exchange"]>;
  onSendProposal: (
    proposal: NewProposal,
    proposalFiles: FileWithEncodedData[]
  ) => void;
  disabled?: boolean;
}

export default function ButtonProposal({
  exchange,
  onSendProposal,
  disabled
}: Props) {
  const { bosonXmtp } = useChatContext();
  const { showModal, updateProps, store } = useModal();
  const [activeStep, setActiveStep] = useState<number>(0);

  const headerComponent = useMemo(
    () => (
      <Grid justifyContent="space-evently">
        <StyledMultiSteps
          data={[
            { steps: 1, name: "Describe Problem" },
            { steps: 1, name: "Make a Proposal" },
            { steps: 1, name: "Review & Submit" }
          ]}
          callback={(step) => {
            setActiveStep(step);
          }}
          active={activeStep}
          disableInactiveSteps
        />
      </Grid>
    ),
    [activeStep]
  );

  useEffect(() => {
    if (bosonXmtp && store.modalType === "MAKE_PROPOSAL") {
      updateProps<"MAKE_PROPOSAL">({
        ...store,
        modalProps: {
          ...store.modalProps,
          headerComponent,
          activeStep
        }
      });
    }
  }, [activeStep, headerComponent, activeStep]); // eslint-disable-line

  return (
    <StyledButton
      disabled={disabled}
      onClick={() =>
        showModal(
          "MAKE_PROPOSAL",
          {
            headerComponent,
            exchange,
            activeStep: 0,
            setActiveStep,
            sendProposal: onSendProposal
          },
          "m"
        )
      }
    >
      Proposal <Plus size={24} />
    </StyledButton>
  );
}
