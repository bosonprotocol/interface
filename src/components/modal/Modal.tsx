import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";
import styled from "styled-components";

import { scrollStyles } from "../../components/ui/styles";
import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";

const paddingTitleAndContent = "1.25rem";

const Root = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: top;
  justify-content: center;
  background-color: #00000080;
  padding: 0;
  ${breakpoint.s} {
    padding: 0 2rem;
  }
  ${breakpoint.m} {
    padding: 0 8rem;
  }
  ${breakpoint.l} {
    padding: 0 10rem;
  }
  ${breakpoint.xl} {
    padding: 0 16rem;
  }
`;

const ModalTitle = styled.div`
  border-bottom: 2px solid ${colors.border};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: ${paddingTitleAndContent};
`;

const Content = styled.div`
  position: relative;
  color: ${colors.black};
  top: 0;
  ${breakpoint.s} {
    top: 4.2rem;
  }
  width: 100%;
  background-color: var(--primaryBgColor);
  border: var(--secondary);
  height: fit-content;
  min-height: 100vh;
  max-height: 100vh;
  margin: 0;

  overflow-x: auto;
  ${breakpoint.s} {
    overflow-x: initial;
    min-height: initial;
  }

  ${scrollStyles}
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CloseButton = styled(IoIosClose)`
  all: unset;
  font-size: 2rem;
  fill: ${colors.black};
  padding: ${paddingTitleAndContent};
  width: 3rem;
  position: relative;
  right: -12px;

  &:hover {
    cursor: pointer;
    fill: var(--secondary);
  }
`;

const ModalContent = styled.div`
  padding: ${paddingTitleAndContent};
  overflow: hidden;
`;

interface Props {
  children: ReactNode;
  isOpen: boolean;
  $styles?: {
    width: string;
  };
  style?: React.CSSProperties;
  onClose?: () => void;
  title?: JSX.Element | string | null | undefined;
}

export function Modal({
  children,
  isOpen,
  onClose,
  style = {},
  title: Title
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
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={style}
      >
        <CloseButtonContainer>
          <ModalTitle>
            {Title ? Title : <div />}
            <CloseButton onClick={onCloseModal} />
          </ModalTitle>
        </CloseButtonContainer>
        <ModalContent>{children}</ModalContent>
      </Content>
    </Root>,
    document.body
  );
}
