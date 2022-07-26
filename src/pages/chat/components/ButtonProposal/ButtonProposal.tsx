import { Plus } from "phosphor-react";
import { useState } from "react";
import styled from "styled-components";

import { useModal } from "../../../../components/modal/useModal";
import MultiSteps from "../../../../components/step/MultiSteps";
import Grid from "../../../../components/ui/Grid";
import { colors } from "../../../../lib/styles/colors";
import { Thread } from "../../types";

const StyledButton = styled.button`
  border: 3px solid ${colors.secondary};
  padding-left: 1.2rem;
  padding-right: 2.5rem;
  font-size: 0.875rem;
  margin-right: 0.875rem;
  height: 2.7rem;
  font-weight: 600;
  color: ${colors.secondary};
  background-color: transparent;
  position: relative;
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0.6rem;
  }
`;

const StyledMultiSteps = styled(MultiSteps)`
  width: 100%;
`;

interface Props {
  exchange: NonNullable<Thread["exchange"]>;
}

export default function ButtonProposal({ exchange }: Props) {
  const { showModal, updateProps, store } = useModal();
  console.log("store", store);
  const [activeStep, setActiveStep] = useState<number>(0);
  return (
    <StyledButton
      onClick={() =>
        showModal("MAKE_PROPOSAL", {
          headerComponent: (
            <Grid justifyContent="space-evently">
              <StyledMultiSteps
                data={[
                  { steps: 1, name: "Describe Problem" },
                  { steps: 1, name: "Make a Proposal" },
                  { steps: 1, name: "Review & Submit" }
                ]}
                callback={(currentStep) => {
                  setActiveStep(currentStep);
                }}
                active={activeStep}
              />
            </Grid>
          ),
          exchange,
          activeStep,
          setActiveStep: (step: number) => {
            updateProps<"MAKE_PROPOSAL">({
              ...store,
              modalProps: { ...store.modalProps, activeStep: step }
            } as any);
          }
        })
      }
    >
      <p>step {activeStep}</p>
      Proposal <Plus size={24} />
    </StyledButton>
  );
}
