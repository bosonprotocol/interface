import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";

export const TagContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 3px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
`;

export const Helper = styled.div`
  position: absolute;
  right: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
  svg {
    margin-bottom: -0.15rem;
  }
`;
export const TagWrapper = styled.div`
  background-color: ${colors.lightGrey};
  display: inline-block;
  padding: 0.5em 0.75em;
`;

export const Close = styled.span`
  color: ${colors.darkGrey};
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.5em;
  font-size: 1.125rem;
  cursor: pointer;
`;
