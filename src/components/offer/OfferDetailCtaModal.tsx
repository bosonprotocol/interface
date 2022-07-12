import styled from "styled-components";

import { Modal } from "../../components/modal/Modal";
import { colors } from "../../lib/styles/colors";
import Typography from "../ui/Typography";

const ModalTitle = styled.div`
  margin: -2rem 0rem 0 0rem;
  padding: 1rem 2rem;
  border-bottom: 2px solid ${colors.border};
  * {
    margin: 0;
  }
`;

const ModalContent = styled.div`
  margin: 2rem;
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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      style={{
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
