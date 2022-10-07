import { Loading } from "@bosonprotocol/react-kit";
import { Fragment } from "react";
import styled, { css, ThemeProvider } from "styled-components";

import { colors } from "../../lib/styles/colors";
import { zIndex } from "../../lib/styles/zIndex";
import Tooltip from "../tooltip/Tooltip";
import * as Styles from "./styles";
import Typography from "./Typography";

const BaseButton = styled.button<{
  size: IButton["size"];
  fill: IButton["fill"];
}>`
  ${() => Styles.button};
  ${(props) => Styles[props.size as keyof typeof Styles]}
  border-style: solid;
  border-color: ${(props) => props.theme.borderColor || "transparent"};
  border-width: ${(props) => props.theme.borderWidth || 0}px;
  color: ${(props) => props.theme.color || "#000000"};
  background-color: ${(props) => props.theme.background || "transparent"};
  ${(props) =>
    props.fill
      ? css`
          width: 100%;
        `
      : ""};
  ${(props) =>
    props.theme.hover &&
    css`
      &:hover:not(:disabled) {
        background-color: ${props.theme.hover.background};
        ${props.theme.hover.color &&
        css`
          color: ${props.theme.hover.color} !important;
          svg {
            fill: ${props.theme.hover.color} !important;
          }
        `};
        ${props.theme.hover.borderColor &&
        css`
          border-color: ${props.theme.hover.borderColor};
        `};
      }
    `}
  ${(props) =>
    props.theme.padding
      ? css`
          padding: ${props.theme.padding} !important;
        `
      : ""}

  ${(props) =>
    props.theme.disabled
      ? css`
          :disabled {
            background-color: ${props.theme.disabled.background ||
            "transparent"};
            color: ${props.theme.disabled.color || colors.darkGrey};
            border-color: transparent;
            cursor: not-allowed;
            opacity: 0.5;
          }
        `
      : css`
          :disabled {
            background-color: ${colors.lightGrey};
            color: ${colors.darkGrey};
            border-color: transparent;
            cursor: not-allowed;
            opacity: 0.5;
          }
        `};
`;

const ChildWrapperButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: ${zIndex.Button};

  ${() => Styles.buttonText};
`;

const allThemes = ({ withBosonStyle }: { withBosonStyle?: boolean }) => {
  return {
    primary: {
      color: withBosonStyle ? colors.black : "var(--textColor)",
      background: withBosonStyle
        ? colors.green
        : `var(--accentNoDefault, ${colors.green})`,
      borderColor: withBosonStyle
        ? colors.green
        : `var(--accentNoDefault, ${colors.green})`,
      borderWidth: 2,
      hover: {
        background: colors.black,
        color: colors.white,
        borderColor: colors.black
      }
    },
    bosonPrimary: {
      color: colors.black,
      background: colors.primary,
      borderColor: colors.primary,
      borderWidth: 2,
      hover: {
        background: colors.black,
        color: colors.white,
        borderColor: colors.black
      }
    },
    secondary: {
      color: "var(--accent)",
      borderColor: "var(--accent)",
      borderWidth: 2,
      hover: {
        background: "var(--accent)",
        color: colors.white
      }
    },
    bosonSecondary: {
      color: colors.secondary,
      borderColor: colors.secondary,
      borderWidth: 2,
      hover: {
        background: colors.secondary,
        color: colors.white
      }
    },
    orangeInverse: {
      color: colors.orange,
      borderColor: colors.orange,
      borderWidth: 2,
      hover: {
        background: colors.orange,
        color: colors.white
      }
    },
    bosonSecondaryInverse: {
      color: colors.white,
      borderColor: colors.secondary,
      background: colors.secondary,
      borderWidth: 2,
      hover: {
        color: colors.secondary,
        borderColor: colors.secondary,
        background: colors.white
      }
    },
    orange: {
      color: colors.orange,
      borderColor: colors.border,
      hover: {
        background: colors.border
      }
    },
    outline: {
      color: colors.black,
      borderColor: colors.border,
      borderWidth: 1,
      hover: {
        background: colors.border,
        color: "var(--accent)"
      }
    },
    ghostSecondary: {
      color: colors.secondary,
      borderColor: colors.border,
      hover: {
        background: colors.border
      }
    },

    blank: {
      color: `${colors.black}4d`,
      padding: "0.75rem 0.5rem",
      hover: {
        color: colors.black
      },
      disabled: {
        background: "transparent"
      }
    },
    blankSecondary: {
      color: "var(--accent)",
      padding: "0.75rem 0.5rem",
      hover: {
        borderColor: colors.secondary,
        background: colors.border,
        color: colors.black
      }
    },
    blankOutline: {
      color: colors.black,
      padding: "1rem 2rem",
      borderWidth: 1,
      hover: {
        borderColor: colors.secondary,
        background: colors.border,
        color: colors.black
      }
    },
    white: {
      color: colors.black,
      background: colors.white,
      padding: "1rem",
      borderWidth: 1,
      borderColor: colors.border,
      hover: {
        color: colors.white,
        background: colors.black
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
    escalate: {
      color: colors.black,
      background: colors.orange,
      borderColor: colors.orange,
      borderWidth: 2,
      hover: {
        background: colors.black,
        color: colors.white,
        borderColor: colors.black
      }
    }
  };
};

export interface IButton {
  children?: string | React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  size?: "small" | "regular" | "large";
  theme?: keyof ReturnType<typeof allThemes>;
  type?: "button" | "submit" | "reset" | undefined;
  fill?: boolean;
  step?: number;
  isLoading?: boolean;
  tooltip?: string;
  [x: string]: unknown;
  withBosonStyle?: boolean;
}

const Button: React.FC<IButton> = ({
  children,
  onClick,
  size = "regular",
  theme = "primary",
  type = "button",
  step = 0,
  fill = false,
  isLoading = false,
  tooltip = "",
  withBosonStyle = false,
  ...rest
}) => {
  const Wrapper =
    tooltip !== "" && rest?.disabled === true ? Tooltip : Fragment;
  const wrapperParams = tooltip !== "" ? { wrap: false, content: tooltip } : {};

  return (
    <ThemeProvider theme={allThemes({ withBosonStyle })[theme]}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Wrapper {...wrapperParams}>
        <BaseButton
          onClick={onClick}
          type={type}
          size={size}
          fill={fill ? fill : undefined}
          {...rest}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <ChildWrapperButton data-child-wrapper-button>
              {children}
              {step !== 0 && (
                <Typography>
                  <small>Step {step}</small>
                </Typography>
              )}
            </ChildWrapperButton>
          )}
        </BaseButton>
      </Wrapper>
    </ThemeProvider>
  );
};

export default Button;
