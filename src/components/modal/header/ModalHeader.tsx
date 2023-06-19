import React, { ReactNode } from "react";

import Button from "../../ui/Button";
import { Close, Header } from "./styles";

interface ModalHeaderProps {
  headerComponent: ReactNode;
  handleOnClose: () => void;
  closable?: boolean;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  headerComponent: HeaderComponent,
  handleOnClose,
  closable
}) => {
  return (
    <Header tag="div" margin="0">
      {HeaderComponent}
      {closable && (
        <Button data-close theme="blank" onClick={handleOnClose}>
          <Close />
        </Button>
      )}
    </Header>
  );
};
