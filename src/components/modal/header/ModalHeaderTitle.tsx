import React from "react";
import styled from "styled-components";

import Button from "../../ui/Button";
import { Close, Header } from "./styles";

const HeaderWithTitle = styled(Header)`
  height: 4.25rem;
`;

interface ModalHeaderTitleProps {
  title: string;
  handleOnClose: () => void;
  closable?: boolean;
}

export const ModalHeaderTitle: React.FC<ModalHeaderTitleProps> = ({
  title,
  handleOnClose,
  closable
}) => {
  return (
    <HeaderWithTitle tag="h3" $title={title} margin="0">
      {title}
      {closable && (
        <Button data-close themeVal="blank" onClick={handleOnClose}>
          <Close />
        </Button>
      )}
    </HeaderWithTitle>
  );
};
