import styled from "styled-components";

import { colors } from "../../../lib/styles/colors";

export const TagContainer = styled.div`
  width: 100%;
  border-radius: 3px;
  margin-top: 1em;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
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
