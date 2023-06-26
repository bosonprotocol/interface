import React, { ReactNode } from "react";

import Button from "../../../ui/Button";
import Grid from "../../../ui/Grid";
import { useModal } from "../../useModal";

interface ConfirmationModalProps {
  text: ReactNode;
  cta: ReactNode;
  children?: ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  text,
  cta,
  children
}) => {
  const { hideModal } = useModal();
  return (
    <Grid flexDirection="column" alignItems="flex-start">
      {text}
      {children}
      <Grid justifyContent="space-between">
        <Button theme="blankSecondaryOutline" onClick={() => hideModal()}>
          Cancel
        </Button>
        {cta}
      </Grid>
    </Grid>
  );
};
