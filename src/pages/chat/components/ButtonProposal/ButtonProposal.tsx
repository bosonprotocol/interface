import { Plus } from "phosphor-react";
import styled from "styled-components";

import { useModal } from "../../../../components/modal/useModal";
import { breakpoint } from "../../../../lib/styles/breakpoint";
import { colors } from "../../../../lib/styles/colors";
import { FileWithEncodedData } from "../../../../lib/utils/files";
import { NewProposal, Thread } from "../../types";

const StyledButton = styled.button`
  border: 3px solid ${colors.secondary};
  padding: 0.75rem 2.5rem 0.75rem 1.2rem;
  font-size: 0.875rem;
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

interface Props {
  exchange: NonNullable<Thread["exchange"]>;
  onSendProposal: (
    proposal: NewProposal,
    proposalFiles: FileWithEncodedData[]
  ) => Promise<void>;
  disabled?: boolean;
}

export default function ButtonProposal({
  exchange,
  onSendProposal,
  disabled
}: Props) {
  const { showModal } = useModal();

  return (
    <StyledButton
      disabled={disabled}
      onClick={() =>
        showModal(
          "MAKE_PROPOSAL",
          {
            exchange,
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
