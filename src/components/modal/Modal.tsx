import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";
import styled from "styled-components";

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

const Content = styled.div<{ $styles: Props["$styles"] }>`
  margin: 24px;
  color: var(--accent);
  width: ${(props) => props.$styles?.width || "60%"};
  border-radius: 8px;
  padding: 16px;
  background-color: var(--primary);
  border: 2px solid var(--accent);
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled(IoIosClose)`
  all: unset;
  stroke: white;
  fill: white;
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
