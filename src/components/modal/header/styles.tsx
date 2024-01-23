import { X } from "phosphor-react";
import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";
import { Typography } from "../../ui/Typography";

export const Close = styled(X)`
  line {
    stroke: ${colors.darkGrey} !important;
    stroke-width: 18px !important;
  }
`;

export const Header = styled(Typography)<{ $title?: string }>`
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
