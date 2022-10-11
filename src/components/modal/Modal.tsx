import { X } from "phosphor-react";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import styled, { css } from "styled-components";

import { breakpoint } from "../../lib/styles/breakpoint";
import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Button from "../ui/Button";
import Typography from "../ui/Typography";
import { ModalType, Store } from "./ModalContext";

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
  xs: {
    xs: "0",
    s: "4rem 12rem",
    m: "4rem 20rem",
    l: "4rem 24rem",
    xl: "4rem 30rem"
  },
  s: {
    xs: "0",
    s: "4rem 10rem",
    m: "4rem 19rem",
    l: "4rem 22rem",
    xl: "4rem 30rem"
  },
  m: {
    xs: "0",
    s: "4rem 6rem",
    m: "4rem 12rem",
    l: "4rem 16rem",
    xl: "4rem 25.75rem"
  },
  l: {
    xs: "0",
    s: "4rem",
    m: "4rem 8rem",
    l: "4rem 10rem",
    xl: "4rem 14rem"
  },
  auto: {
    xs: "4rem auto",
    s: "4rem auto",
    m: "4rem auto",
    l: "4rem auto",
    xl: "4rem auto"
  },
  fullscreen: {
    xs: "0 auto",
    s: "0 auto",
    m: "0 auto",
    l: "0 auto",
    xl: "0 auto"
  }
} as const;

const background = {
  primaryBgColor: "var(--primaryBgColor)",
  dark: `${colors.black}`,
  light: `${colors.white}`
} as const;

const Wrapper = styled.div<{
  $modalType: ModalType;
  $size: Props["size"];
  $theme: Props["theme"];
  $maxWidths: Props["maxWidths"];
}>`
  position: relative;
  z-index: ${zIndex.Modal};
  color: ${({ $theme }) => {
    switch ($theme) {
      case "dark":
        return colors.white;
      default:
        return colors.black;
    }
  }};
  background-color: ${({ $theme }) => {
    return background[$theme as keyof typeof background] || colors.white;
  }};
  border: var(--secondary);
  ${({ $maxWidths }) => {
    if (!$maxWidths) {
      return "";
    }

    return css`
      ${breakpoint.xxs} {
        max-width: ${$maxWidths["xxs"]};
      }
      ${breakpoint.xs} {
        max-width: ${$maxWidths["xs"]};
      }
      ${breakpoint.s} {
        max-width: ${$maxWidths["s"]};
      }
      ${breakpoint.m} {
        max-width: ${$maxWidths["m"]};
      }
      ${breakpoint.l} {
        max-width: ${$maxWidths["l"]};
      }
      ${breakpoint.xl} {
        max-width: ${$maxWidths["xl"]};
      }
    `;
  }};
  ${({ $modalType }) => {
    switch ($modalType) {
      case "PRODUCT_CREATE_SUCCESS":
        return css`
          max-width: 65.875rem;
        `;
      case "FINANCE_WITHDRAW_MODAL":
      case "FINANCE_DEPOSIT_MODAL":
      case "MANAGE_FUNDS_MODAL":
      case "EXPIRE_VOUCHER_MODAL":
      case "DISPUTE_RESOLUTION_DECIDE_MODAL":
      case "DISPUTE_RESOLUTION_REFUSE_MODAL":
        return css`
          ${breakpoint.xs} {
            max-width: 31.25rem;
          }
        `;
      default:
        break;
    }
  }};
  margin: ${({ $size }) =>
    sizeToMargin[$size as keyof typeof sizeToMargin]["xs"] || 0};
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
  ${({ $size }) =>
    $size === "fullscreen" &&
    `
      min-height: 100vh;
    `};
`;

const Header = styled(Typography)<{ $title?: string }>`
  position: relative;

  text-align: left;
  padding: 1rem 2rem;
  display: flex;
  border-bottom: 2px solid ${colors.border};
  align-items: center;
  justify-content: ${(props) => {
    return props.$title ? "space-between" : "flex-end";
  }};
  gap: 0.5rem;
`;

const HeaderWithTitle = styled(Header)`
  height: 4.25rem;
`;

const Close = styled(X)`
  line {
    stroke: ${colors.darkGrey};
  }
`;

const Content = styled.div<{
  $modalType: ModalType;
  $size: Props["size"];
}>`
  padding: ${({ $modalType }) => {
    switch ($modalType) {
      case "FINANCE_WITHDRAW_MODAL":
      case "FINANCE_DEPOSIT_MODAL":
      case "MANAGE_FUNDS_MODAL":
      case "DISPUTE_RESOLUTION_DECIDE_MODAL":
      case "DISPUTE_RESOLUTION_REFUSE_MODAL":
        return "0 2rem 2rem 2rem";
      case "EXPIRE_VOUCHER_MODAL":
        return "2rem 0";
      default:
        return "2rem";
    }
  }};

  ${({ $size }) =>
    $size === "fullscreen"
      ? `
  max-height: calc(100vh - 4.25rem);

  ${breakpoint.s} {
    max-height: calc(100vh - 4.25rem);
  }
  ${breakpoint.m} {
    max-height: calc(100vh - 4.25rem);
  }
  `
      : `
  max-height: calc(100vh - 4.25rem);

  ${breakpoint.s} {
    max-height: calc(100vh - 4rem - 4.25rem);
  }
  ${breakpoint.m} {
    max-height: calc(100vh - 8rem - 4.25rem);
  }
  `};
  overflow: auto;
`;

interface Props {
  children: React.ReactNode;
  hideModal: () => void;
  title?: string;
  noCloseIcon?: boolean;
  modalType: ModalType;
  headerComponent?: ReactNode;
  size: NonNullable<Store["modalSize"]>;
  maxWidths: Store["modalMaxWidth"];
  theme: NonNullable<Store["theme"]>;
  closable?: boolean;
  onClose?: () => void;
}

export default function Modal({
  children,
  hideModal,
  title = "",
  headerComponent: HeaderComponent,
  size,
  maxWidths,
  theme,
  closable = true,
  onClose,
  modalType
}: Props) {
  const handleOnClose = () => {
    if (closable) {
      hideModal();
      onClose?.();
    }
  };
  return createPortal(
    <Root data-testid="modal">
      <Wrapper
        $size={size}
        $modalType={modalType}
        $theme={theme}
        $maxWidths={maxWidths}
      >
        {HeaderComponent ? (
          <Header tag="div" margin="0">
            {HeaderComponent}
            {closable && (
              <Button data-close theme="blank" onClick={handleOnClose}>
                <Close />
              </Button>
            )}
          </Header>
        ) : (
          <HeaderWithTitle tag="h3" $title={title} margin="0">
            {title}
            {closable && (
              <Button data-close theme="blank" onClick={handleOnClose}>
                <Close />
              </Button>
            )}
          </HeaderWithTitle>
        )}
        <Content $size={size} $modalType={modalType}>
          {children}
        </Content>
      </Wrapper>
      <RootBG
        onClick={() => {
          handleOnClose();
        }}
      />
    </Root>,
    document.body
  );
}
