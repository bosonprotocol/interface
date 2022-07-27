import { X as Close } from "phosphor-react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Button from "../ui/Button";
import { scrollStyles } from "../ui/styles";
import Typography from "../ui/Typography";
import { ModalType } from "./ModalContext";
const Root = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.Modal};
`;

const RootBG = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #00000080;
  z-index: ${zIndex.Modal - 1};
`;

const Wrapper = styled.div<{ modalType: ModalType }>`
  position: relative;
  z-index: ${zIndex.Modal};
  color: ${colors.black};
  background-color: var(--primaryBgColor);
  border: var(--secondary);
  max-width: ${({ modalType }) =>
    modalType === "PRODUCT_CREATE_SUCCESS" ? "1054px" : "auto"};
  margin: 0;
  ${breakpoint.s} {
    margin: 4rem;
  }
  ${breakpoint.m} {
    margin: 4rem 8rem;
  }
  ${breakpoint.l} {
    margin: 4rem 10rem;
  }
  ${breakpoint.xl} {
    margin: 4rem 14rem;
  }
`;

const Title = styled(Typography)<{ modalType: ModalType }>`
  position: relative;
  height: 4.25rem;
  text-align: ${({ modalType }) =>
    modalType === "PRODUCT_CREATE_SUCCESS" ? "center" : "left"};
  padding: ${({ modalType }) =>
    modalType === "PRODUCT_CREATE_SUCCESS" ? "1rem 0" : "1rem 8rem"};
  margin: 0;
  display: block;
  border-bottom: 2px solid ${colors.border};
  > button {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0%, -50%);
  }
`;

const Content = styled.div`
  padding: 2rem;

  max-height: calc(100vh - 4.25rem);

  ${breakpoint.s} {
    max-height: calc(100vh - 4rem - 4.25rem);
  }
  ${breakpoint.m} {
    max-height: calc(100vh - 8rem - 4.25rem);
  }
  overflow: auto;
  ${scrollStyles}
`;

interface Props {
  children: React.ReactNode;
  hideModal: () => void;
  title?: string;
  noCloseIcon?: boolean;
  modalType: ModalType;
}

export default function Modal({
  children,
  hideModal,
  title = "modal",
  noCloseIcon = false,
  modalType
}: Props) {
  const handleHideModal = () => {
    if (noCloseIcon) {
      return;
    }
    hideModal();
  };
  return createPortal(
    <Root data-testid="modal">
      <Wrapper modalType={modalType}>
        <Title tag="h3" modalType={modalType}>
          {title}
          {!noCloseIcon && (
            <Button theme="blank" onClick={hideModal}>
              <Close />
            </Button>
          )}
        </Title>
        <Content>{children}</Content>
      </Wrapper>
      <RootBG onClick={handleHideModal} />
    </Root>,
    document.body
  );
}
