import Modal from "components/modal/Modal";

import TokenSafety, { TokenSafetyProps } from ".";

interface TokenSafetyModalProps extends TokenSafetyProps {
  isOpen: boolean;
}

export default function TokenSafetyModal({
  isOpen,
  tokenAddress,
  secondTokenAddress,
  onContinue,
  onCancel,
  onBlocked,
  showCancel
}: TokenSafetyModalProps) {
  return (
    <Modal
      hidden={!isOpen}
      hideModal={onCancel}
      size="auto"
      modalType={"ACCOUNT_CREATION"}
    >
      <TokenSafety
        tokenAddress={tokenAddress}
        secondTokenAddress={secondTokenAddress}
        onContinue={onContinue}
        onBlocked={onBlocked}
        onCancel={onCancel}
        showCancel={showCancel}
      />
    </Modal>
  );
}
