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
// TODO: refactor colors to use css vars or theme
const Content = styled.div<{ $styles: Props["$styles"] }>`
  margin: 24px;
  color: var(--secondary);
  width: ${(props) => props.$styles?.width || "60%"};
  border-radius: 8px;
  padding: 16px;
  background-color: var(--primaryBgColor);
  border: var(--secondary);

  max-height: 90vh;
  overflow-x: auto;

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 var(--scrollbarWidth) var(--scrollbarBg);
    box-shadow: inset 0 0 var(--scrollbarWidth) var(--scrollbarBg);
    border-radius: 0;
    background-color: var(--scrollbarBg);
  }

  ::-webkit-scrollbar {
    width: var(--scrollbarWidth);
    height: 0;
    background-color: var(--scrollbarBg);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    -webkit-box-shadow: inset 0 0 var(--scrollbarWidth) var(--scrollbarThumb);
    box-shadow: inset 0 0 var(--scrollbarWidth) var(--scrollbarThumb);
    background-color: var(--scrollbarThumb);
  }
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled(IoIosClose)`
  all: unset;
  stroke: var(--secondary);
  fill: var(--secondary);
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
  style?: React.CSSProperties;
  onClose?: () => void;
}

export function Modal({
  children,
  isOpen,
  onClose,
  style = {},
  $styles
}: Props) {
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
        style={style}
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
