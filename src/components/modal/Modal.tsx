import { X as Close } from "phosphor-react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Button from "../ui/Button";
import { scrollStyles } from "../ui/styles";
import Typography from "../ui/Typography";
import { Store } from "./ModalContext";

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

const sizeToMargin = {
  s: {
    s: "4rem 10rem",
    m: "4rem 19rem",
    l: "4rem 22rem",
    xl: "4rem 30rem"
  },
  m: {
    s: "4rem 6rem",
    m: "4rem 12rem",
    l: "4rem 16rem",
    xl: "4rem 25.75rem"
  },
  l: {
    s: "4rem",
    m: "4rem 8rem",
    l: "4rem 10rem",
    xl: "4rem 14rem"
  }
} as const;

const Wrapper = styled.div<{ $size: Props["size"] }>`
  position: relative;
  z-index: ${zIndex.Modal};
  color: ${colors.black};
  background-color: var(--primaryBgColor);
  border: var(--secondary);

  margin: 0;
  ${breakpoint.s} {
    margin: ${({ $size }) =>
      sizeToMargin[$size as keyof typeof sizeToMargin]["s"] || "4rem"};
  }
  ${breakpoint.m} {
    margin: ${({ $size }) =>
      sizeToMargin[$size as keyof typeof sizeToMargin]["m"] || "4rem 8rem"};
  }
  ${breakpoint.l} {
    margin: ${({ $size }) =>
      sizeToMargin[$size as keyof typeof sizeToMargin]["l"] || "4rem 10rem"};
  }
  ${breakpoint.xl} {
    margin: ${({ $size }) =>
      sizeToMargin[$size as keyof typeof sizeToMargin]["xl"] || "4rem 14rem"};
  }
`;

const Header = styled(Typography)`
  position: relative;
  height: 4.25rem;
  padding: 1rem 2rem;
  margin: 0;
  padding-right: 8rem;
  border-bottom: 2px solid ${colors.border};
  > button[data-close] {
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
  headerComponent?: ReactNode;
  size: NonNullable<Store["modalSize"]>;
  closable?: boolean;
}

export default function Modal({
  children,
  hideModal,
  title = "modal",
  headerComponent: HeaderComponent,
  size,
  closable = true
}: Props) {
  return createPortal(
    <Root data-testid="modal">
      <Wrapper $size={size}>
        {HeaderComponent ? (
          <Header tag="div">
            {HeaderComponent}
            {closable && (
              <Button data-close theme="blank" onClick={hideModal}>
                <Close />
              </Button>
            )}
          </Header>
        ) : (
          <Header tag="h3">
            {title}
            {closable && (
              <Button data-close theme="blank" onClick={hideModal}>
                <Close />
              </Button>
            )}
          </Header>
        )}
        <Content>{children}</Content>
      </Wrapper>
      <RootBG
        onClick={() => {
          closable && hideModal();
        }}
      />
    </Root>,
    document.body
  );
}
