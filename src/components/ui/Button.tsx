import styled, { ThemeProvider } from "styled-components";

import { colors } from "../../lib/styles/colors";

const BaseButton = styled.button`
  min-width: fit-content;
  all: unset;
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  display: block;
  border-style: solid;
  border-color: ${(props) => props.theme.borderColor || "transparent"};
  border-width: ${(props) => props.theme.borderWidth || 0}px;
  color: ${(props) => props.theme.color || "#000000"};
  background-color: ${(props) => props.theme.background || "transparent"};

  position: relative;
  overflow: hidden;

  transition: all 300ms ease-in-out;
  &:before {
    transition: all 300ms ease-in-out;
  }
  ${(props) =>
    props.theme.hover &&
    `
    &:before {
      content: "";
      position: absolute;
      width: 0;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      z-index: 0;
      background-color: ${props.theme.hover.background};
      height: 280px;
    }
    &:hover {
      ${
        props.theme.hover.color
          ? `color: ${props.theme.hover.color} !important;`
          : ""
      }
      &:before {
        width: 100%;
        transform: translate(-50%, -50%) rotate(-90deg);
      }
    }
  `}
`;

const ChildWrapperButton = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;

  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  white-space: pre;
`;

const allThemes = {
  primary: {
    color: colors.secondary,
    borderColor: colors.secondary,
    borderWidth: 2,
    hover: {
      background: colors.secondary,
      color: colors.white
    }
  },
  secondary: {
    color: colors.black,
    background: colors.primary,
    borderColor: colors.primary,
    borderWidth: 2,
    hover: {
      background: colors.white
    }
  },
  outline: {
    text: colors.black,
    borderColor: colors.border,
    borderWidth: 1,
    hover: {
      background: colors.border
    }
  },
  warning: {
    color: colors.black,
    borderColor: colors.orange,
    borderWidth: 2,
    hover: {
      background: colors.orange,
      color: colors.white
    }
  },
  error: {
    color: colors.white,
    background: colors.red,
    borderColor: colors.red,
    borderWidth: 2,
    hover: {
      background: colors.white,
      color: colors.black
    }
  }
};

interface IButton {
  children?: string | React.ReactNode;
  onClick: () => void;
  theme?: keyof typeof allThemes;
  type?: "button" | "submit" | "reset" | undefined;
}

const Button: React.FC<IButton> = ({
  children,
  onClick,
  theme = "primary",
  type = "button"
}) => {
  return (
    <ThemeProvider theme={allThemes[theme as keyof typeof allThemes]}>
      <BaseButton onClick={onClick} type={type}>
        <ChildWrapperButton>{children}</ChildWrapperButton>
      </BaseButton>
    </ThemeProvider>
  );
};

export default Button;
