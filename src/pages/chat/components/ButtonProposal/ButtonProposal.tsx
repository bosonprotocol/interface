import { Plus } from "phosphor-react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useModal } from "../../../../components/modal/useModal";
import MultiSteps from "../../../../components/step/MultiSteps";
import Grid from "../../../../components/ui/Grid";
import { colors } from "../../../../lib/styles/colors";
import { NewProposal, Thread } from "../../types";

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
          active={activeStep}
        />
      </Grid>
    ),
    [activeStep]
  );

  useEffect(() => {
    updateProps<"MAKE_PROPOSAL">({
      ...store,
      modalProps: {
        ...store.modalProps,
        headerComponent,
        activeStep
      }
    });
  }, [activeStep, headerComponent, activeStep]); // eslint-disable-line

  const sendProposal = (proposal: NewProposal) => {
    console.log("proposal in button proposal", proposal);
  };

  return (
    <StyledButton
      onClick={() =>
        showModal("MAKE_PROPOSAL", {
          headerComponent,
          exchange,
          activeStep,
          setActiveStep,
          sendProposal
        })
      }
    >
      Proposal <Plus size={24} />
    </StyledButton>
  );
}
