import { colors } from "lib/styles/colors";
import { Trash } from "phosphor-react";
import { styled } from "styled-components";

export const Delete = styled(Trash)`
  cursor: pointer;
  align-self: center;
  justify-self: center;
  border: 3px solid ${colors.border};
  padding: 0.5rem;
  border-radius: 50%;
  box-sizing: content-box;
  &:hover {
    background-color: ${colors.lightGrey};
  }
`;
