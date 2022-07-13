import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";
import styled from "styled-components";

import { scrollStyles } from "../../components/ui/styles";
import { breakpoint } from "../../lib/styles/breakpoint";
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
  background-color: #00000080;
`;
// TODO: refactor colors to use css vars or theme
const Content = styled.div<{ $styles: Props["$styles"] }>`
  position: relative;
  color: var(--secondary);
  width: ${(props) => props.$styles?.width || "60%"};
  border-radius: 8px;
  padding: 16px;
  background-color: var(--primaryBgColor);
  border: var(--secondary);

  min-height: 100vh;
  max-height: 100vh;
  margin: 0;

  overflow-x: auto;
  ${breakpoint.s} {
    overflow-x: initial;
    min-height: initial;
    max-height: 90vh;
    margin: 2rem;
  }

  ${scrollStyles}
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = styled(IoIosClose)`
  all: unset;
  font-size: 2rem;
  position: absolute;
  right: 0;
  fill: ${colors.black};
  padding: 1.25rem;
  width: 2rem;

  ${breakpoint.s} {
    padding: 1.75rem;
    width: 3rem;
  }
  &:hover {
    cursor: pointer;
    fill: var(--secondary);
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
