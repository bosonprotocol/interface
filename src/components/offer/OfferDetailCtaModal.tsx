import styled from "styled-components";

import { Modal } from "../../components/modal/Modal";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { useBreakpoints } from "../../lib/utils/hooks/useBreakpoints";
import Typography from "../ui/Typography";

const ModalTitle = styled.div`
  margin: 0;
  padding: 1rem;
  border-bottom: 2px solid ${colors.border};

  ${breakpoint.s} {
    padding: 2rem;
  }
  * {
    margin: 0;
  }
`;

const ModalContent = styled.div`
  margin: 2rem;
  ${breakpoint.s} {
    margin: 3rem;
  }
`;

interface Props {
  title?: string;
  children?: React.ReactNode | string;
  isOpen: boolean;
  onClose: () => void;
}

export default function OfferDetailCtaModal({
  title = "Modal",
  isOpen,
  onClose,
  children
}: Props) {
  const { isLteS, isLteM } = useBreakpoints();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      style={{
        width: isLteS ? "100%" : isLteM ? "80%" : "70%",
        padding: "0",
        borderRadius: 0,
        borderWidth: 0,
        background: colors.white,
        color: colors.black,
        fill: colors.black
      }}
    >
      <ModalTitle>
        <Typography tag="h3">
          <b>{title}</b>
        </Typography>
      </ModalTitle>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
}
