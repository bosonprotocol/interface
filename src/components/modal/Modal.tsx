import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";

const Root = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0004;
`;
// TODO: refactor colors to use css vars or theme
const Content = styled.div<{ $styles: Props["$styles"] }>`
  margin: 24px;
  color: ${colors.white}; //var(--secondary);
  width: ${(props) => props.$styles?.width || "60%"};
  border-radius: 8px;
  padding: 16px;
  background-color: rgb(67, 70, 79); //var(--primaryBgColor);
  border: 2px solid ${colors.white}; //var(--secondary);
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled(IoIosClose)`
  all: unset;
  stroke: ${colors.white}; //var(--secondary);
  fill: ${colors.white}; //var(--secondary);
  font-size: 2rem;
  :hover {
    cursor: pointer;
  }
`;

interface Props {
  children: ReactNode;
  isOpen: boolean;
  $styles?: {
    width: string;
  };
  onClose?: () => void;
}

export function Modal({ children, isOpen, onClose, $styles }: Props) {
  if (!isOpen) {
    return null;
  }
  const onCloseModal = () => {
    onClose?.();
  };
  return createPortal(
    <Root onClick={onCloseModal}>
      <Content
        $styles={$styles}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <CloseButtonContainer>
          <CloseButton onClick={onCloseModal} />
        </CloseButtonContainer>
        {children}
      </Content>
    </Root>,
    document.body
  );
}
