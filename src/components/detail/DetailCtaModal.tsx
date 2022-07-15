import { Modal } from "../../components/modal/Modal";
import Typography from "../ui/Typography";
import { CtaModalContent, CtaModalTitle } from "./Detail.style";

interface Props {
  title?: string;
  children?: React.ReactNode | string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailCtaModal({
  title = "Modal",
  isOpen,
  onClose,
  children
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <CtaModalTitle>
        <Typography tag="h3">
          <b>{title}</b>
        </Typography>
      </CtaModalTitle>
      <CtaModalContent>{children}</CtaModalContent>
    </Modal>
  );
}
