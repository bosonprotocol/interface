import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light-border.css";
import "tippy.js/animations/shift-toward.css";

import Tippy from "@tippyjs/react";
import { IconWeight, Question } from "phosphor-react";
import React from "react";
import styled from "styled-components";

import { colors } from "../../lib/styles/colors";
import * as Styles from "../ui/styles";
interface Props {
  content: string | JSX.Element | React.ReactNode;
  children?: React.ReactNode;
  interactive?: boolean;
  size?: number;
  weight?: IconWeight;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "left-start"
    | "left-end"
    | "auto"
    | "auto-start"
    | "auto-end";
  trigger?:
    | "mouseenter focus"
    | "mouseenter click"
    | "click"
    | "focusin"
    | "manual";
}

const Button = styled.button`
  ${() => Styles.button};
  display: flex;
  color: ${colors.darkGrey};
  background-color: transparent;
  margin: 0 0.5rem;
  :hover {
    color: ${colors.black};
  }
`;

export default function Tooltip({
  content,
  children,
  placement = "bottom",
  interactive = false,
  size = 18,
  weight = "regular",
  trigger = "mouseenter focus",
  ...rest
}: Props) {
  return (
    <Tippy
      content={content}
      placement={placement}
      theme="light-border"
      duration={300}
      animation="shift-toward"
      interactive={interactive}
      trigger={trigger}
      {...rest}
    >
      <Button type="button">
        {children ? children : <Question size={size} weight={weight} />}
      </Button>
    </Tippy>
  );
}
