import styled, { ThemeProvider } from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import * as Styles from "./styles";

const BaseButton = styled.button<{
  size: IButton["size"];
}>`
  ${() => Styles.button};
  ${(props) => Styles[props.size as keyof typeof Styles]}
  border-style: solid;
  border-color: ${(props) => props.theme.borderColor || "transparent"};
  border-width: ${(props) => props.theme.borderWidth || 0}px;
  color: ${(props) => props.theme.color || "#000000"};
  background-color: ${(props) => props.theme.background || "transparent"};

  ${(props) =>
    props.theme.hover &&
    `
    &:hover:not(:disabled) {
      background-color: ${props.theme.hover.background};
      ${
        props.theme.hover.color
          ? `
          color: ${props.theme.hover.color} !important;
          svg {
            fill: ${props.theme.hover.color} !important;
          }
          `
          : ""
      }
    }
  `}
  :disabled {
    background-color: ${colors.darkGrey};
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ChildWrapperButton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: ${zIndex.Button};

  ${() => Styles.buttonText};
  white-space: pre;
`;

const allThemes = {
  primary: {
    color: "var(--secondary)",
    borderColor: "var(--secondary)",
    borderWidth: 2,
    hover: {
      background: "var(--secondary)",
      color: colors.white
    }
  },
  secondary: {
    color: colors.black,
    background: "var(--primary)",
    hover: {
      background: colors.black,
      color: colors.white
    }
  },
  outline: {
    text: colors.black,
    borderColor: colors.border,
    borderWidth: 1,
    hover: {
      background: colors.border,
      color: "var(--secondary)"
    }
  },
  blank: {
    color: "var(--secondary)",
    hover: {
      color: colors.black
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
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  size?: "small" | "regular" | "large";
  theme?: keyof typeof allThemes;
  type?: "button" | "submit" | "reset" | undefined;
  [x: string]: unknown;
}

const Button: React.FC<IButton> = ({
  children,
  onClick,
  size = "regular",
  theme = "primary",
  type = "button",
  ...rest
}) => {
  return (
    <ThemeProvider theme={allThemes[theme as keyof typeof allThemes]}>
      <BaseButton onClick={onClick} type={type} size={size} {...rest}>
        <ChildWrapperButton>{children}</ChildWrapperButton>
      </BaseButton>
    </ThemeProvider>
  );
};

export default Button;
